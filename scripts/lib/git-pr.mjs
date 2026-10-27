// Git and gh through argument arrays, never through a shell string. Nothing that came out of an
// issue body can reach an argument that git or gh would interpret.

import { execFileSync } from "node:child_process";

export function run(command, args, { allowFailure = false } = {}) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    if (allowFailure) return { failed: true, stderr: String(error.stderr ?? error.message).trim() };
    throw new Error(`${command} ${args.join(" ")} failed: ${String(error.stderr ?? error.message).trim()}`);
  }
}

export function configureGit() {
  run("git", ["config", "user.name", "openshelf-bot"]);
  run("git", ["config", "user.email", "openshelf-bot@users.noreply.github.com"]);
}

/**
 * Commits the given paths on a branch that starts from the current HEAD, pushes it, and opens one
 * pull request. Returns the pull request URL, or null when gh refused (an open pull request for the
 * same branch, for example).
 */
export function openPullRequest({ branch, paths, message, title, body, repo }) {
  // The branch belongs to one issue. If it already exists, it may hold a moderator's corrections:
  // never force over it, and never rebuild it from today's main. A person decides.
  const existing = run("git", ["ls-remote", "--heads", "origin", branch], { allowFailure: true });
  if (typeof existing === "string" && existing.trim() !== "") {
    return { changed: false, url: null, existing: true };
  }
  if (typeof existing !== "string") {
    return { changed: false, url: null, error: `git ls-remote failed: ${existing.stderr}` };
  }

  run("git", ["checkout", "-B", branch]);
  for (const path of paths) run("git", ["add", "--", path]);
  const status = run("git", ["status", "--porcelain"]);
  if (!status) return { changed: false, url: null };
  run("git", ["commit", "-m", message]);
  // No force: a rejected push means someone else changed the branch, and that is a person's call.
  run("git", ["push", "origin", branch]);

  const result = run(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      repo,
      "--base",
      "main",
      "--head",
      branch,
      "--title",
      title,
      "--body",
      body,
    ],
    { allowFailure: true },
  );
  if (typeof result === "string") return { changed: true, url: result };
  return { changed: true, url: null, error: result.stderr };
}

export function commentOnIssue({ repo, number, body }) {
  return run("gh", ["issue", "comment", String(number), "--repo", repo, "--body", body], {
    allowFailure: true,
  });
}
