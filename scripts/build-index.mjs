#!/usr/bin/env node
// Builds the data the site renders: every template with its derived links and its vote count.
//
//   node scripts/build-index.mjs
//
// Votes are the 👍 reactions on the submission issue that opened the pull request, read through the
// GitHub API at build time. They are never stored in a template file, so a contributor cannot write
// their own count. Without a token the build still succeeds and reports the count as unknown.

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { deepLink, nameKey, templateId } from "./lib/rules.mjs";
import { parseIssueForm } from "./lib/issue-form.mjs";
import { validateTemplates } from "./lib/validate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const templatesDir = join(root, "templates");
const outDir = join(root, "site", "src", "data");

const args = process.argv.slice(2);
const repoArg = args.find((arg) => arg.startsWith("--repo="))?.slice("--repo=".length);
const repo = process.env.GITHUB_REPOSITORY || repoArg || "kodji7202-code/openshelf";
const token = process.env.GITHUB_TOKEN || "";

const { results, failed } = await validateTemplates(templatesDir, { checkLinks: false });
if (failed > 0) {
  for (const result of results) {
    for (const problem of result.problems) console.error(`${result.name}: ${problem.field}: ${problem.message}`);
  }
  console.error(`\n${failed} template(s) are invalid. Fix them before building.`);
  process.exit(1);
}

const votes = new Map();
let votesAvailable = Boolean(token);
for (const result of results) {
  const issue = result.template?.sourceIssue;
  if (!Number.isInteger(issue) || issue < 1) continue;
  if (!votesAvailable) continue;
  // Keyed by slug, the one identifier the file name, the branch and the page all share.
  votes.set(result.template.slug, await countUpvotes(repo, issue, result.template.officialLink, token));
}
if (!token) console.warn("GITHUB_TOKEN is not set: vote counts are reported as unknown.");

const templates = results
  .map(({ template }) => {
    const id = templateId(template.officialLink);
    return {
      ...template,
      id,
      deepLink: deepLink(template.officialLink),
      votes: votes.has(template.slug) ? votes.get(template.slug) : null,
    };
  })
  .sort((left, right) => {
    if (left.status !== right.status) return left.status === "published" ? -1 : 1;
    const votesDelta = (right.votes ?? -1) - (left.votes ?? -1);
    if (votesDelta !== 0) return votesDelta;
    return nameKey(left.name).localeCompare(nameKey(right.name));
  });

await mkdir(outDir, { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  repo,
  votesAvailable,
  templates,
};
await writeFile(join(outDir, "templates.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const published = templates.filter((template) => template.status === "published").length;
console.log(`${templates.length} template(s) indexed, ${published} published, votes ${votesAvailable ? "read" : "unknown"}.`);
console.log(`Wrote ${join("site", "src", "data", "templates.json")}.`);

/**
 * 👍 reactions on the submission issue, counted once per account.
 *
 * `sourceIssue` sits in a file a contributor can edit, so a number alone proves nothing. It counts
 * only when that issue carries the `submission` label and its body names the same official link:
 * an arbitrary issue with many reactions cannot be borrowed that way.
 */
async function countUpvotes(repository, issueNumber, officialLink, githubToken) {
  const submission = await api(`https://api.github.com/repos/${repository}/issues/${issueNumber}`, githubToken);
  if (submission === null) return null;
  const labels = Array.isArray(submission?.labels) ? submission.labels.map((label) => label?.name) : [];
  // The link must be in the field the form writes, not anywhere in the body: an old issue of this
  // repository that merely quotes the link (a report, a comment thread) must not lend its votes.
  const declared = parseIssueForm(submission?.body ?? "").get("Official template link")?.trim();
  if (!labels.includes("submission") || declared !== officialLink) {
    console.warn(
      `#${issueNumber} is not the submission of ${officialLink} (link field: ${declared ?? "missing"}): votes reported as unknown.`,
    );
    return null;
  }

  const users = new Set();
  let url = `https://api.github.com/repos/${repository}/issues/${issueNumber}/reactions?content=%2B1&per_page=100`;
  for (let page = 0; page < 5 && url; page += 1) {
    const response = await api(url, githubToken, { raw: true });
    if (response === null) return null;
    for (const item of await response.json())
      if (item?.user?.login) users.add(String(item.user.login).toLowerCase());
    url = nextPage(response.headers.get("link"));
  }
  return users.size;
}

/** One GitHub API call. Null on any failure: a vote count never blocks a deploy. */
async function api(url, githubToken, { raw = false } = {}) {
  let response;
  try {
    response = await fetch(url, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${githubToken}`,
        "x-github-api-version": "2022-11-28",
        "user-agent": "openshelf-build",
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.warn(`GitHub API call failed: ${error.message}`);
    return null;
  }
  if (!response.ok) {
    console.warn(`GitHub API answered ${response.status} for ${url.replace(/\?.*$/u, "")}`);
    return null;
  }
  if (raw) return response;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function nextPage(link) {
  if (!link) return null;
  const match = /<([^>]+)>;\s*rel="next"/u.exec(link);
  return match ? match[1] : null;
}
