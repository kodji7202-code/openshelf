#!/usr/bin/env node
// Weekly: does every published official link still answer 200?
//
// A link that fails twice in a row is delisted through a pull request, as DESIGN.md requires. The
// count lives in state/link-health.json, so one bad minute never removes a template.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { configureGit, openPullRequest, run } from "./lib/git-pr.mjs";
import { templateId } from "./lib/rules.mjs";
import { templateFiles, validateTemplates } from "./lib/validate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const templatesDir = join(root, "templates");
const stateDir = join(root, "state");
const stateFile = join(stateDir, "link-health.json");
const repo = process.env.GITHUB_REPOSITORY ?? "kodji7202-code/openshelf";

const { results, failed } = await validateTemplates(templatesDir, { checkLinks: false });
if (failed > 0) {
  console.error("templates/ is invalid; fix it before checking links.");
  process.exit(1);
}

let state = { checkedAt: null, templates: {} };
try {
  state = JSON.parse(await readFile(stateFile, "utf8"));
} catch {
  // First run: no state yet.
}

const changes = [];
const now = new Date().toISOString();

for (const { template, name } of results) {
  const id = templateId(template.officialLink);
  if (!id) continue;
  const status = await check(template.officialLink);
  const previous = state.templates?.[template.slug] ?? { failures: 0 };
  const failures = status === 200 ? 0 : (previous.failures ?? 0) + 1;
  state.templates = state.templates ?? {};
  state.templates[template.slug] = { status, failures, checkedAt: now };
  console.log(`${status === 200 ? "ok  " : "FAIL"} ${name} ${template.officialLink} (${status ?? "unreachable"})`);
  if (failures >= 2 && template.status === "published") {
    const file = join(templatesDir, `${template.slug}.json`);
    const updated = { ...template, status: "delisted" };
    await writeFile(file, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
    changes.push({ slug: template.slug, name: template.name, status });
  }
}

state.checkedAt = now;
await mkdir(stateDir, { recursive: true });
await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");

if (changes.length === 0) {
  console.log("no template reached two failures; nothing to delist.");
  run("git", ["add", "--", "state/link-health.json"]);
  const status = run("git", ["status", "--porcelain"]);
  if (!status) process.exit(0);
  configureGit();
  run("git", ["commit", "-m", "Link check: record results"]);
  run("git", ["push", "origin", "HEAD:main"], { allowFailure: true });
  process.exit(0);
}

configureGit();
const paths = ["state/link-health.json", ...changes.map((change) => join("templates", `${change.slug}.json`))];
const result = openPullRequest({
  branch: `linkcheck/${now.slice(0, 10)}`,
  paths,
  message: `Link check: delist ${changes.length} template(s)`,
  title: `Link check: delist ${changes.length} template(s)`,
  body: [
    "These official links failed twice in a row, so the templates are delisted:",
    "",
    ...changes.map((change) => `- \`${change.slug}\` (${change.name}): HTTP ${change.status ?? "unreachable"}`),
    "",
    "Merging hides them from the list but keeps their pages. If a link comes back, the author can reopen a pull request that sets `status` to `published`.",
  ].join("\n"),
  repo,
});
console.log(result.url ?? result.error ?? "no change");

async function check(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "openshelf-linkcheck" },
    });
    await response.body?.cancel();
    return response.status;
  } catch {
    return null;
  }
}

void templateFiles;
