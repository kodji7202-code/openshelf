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
  votes.set(result.name, await countUpvotes(repo, issue, token));
}
if (!token) console.warn("GITHUB_TOKEN is not set: vote counts are reported as unknown.");

const templates = results
  .map(({ template }) => {
    const id = templateId(template.officialLink);
    return {
      ...template,
      id,
      deepLink: deepLink(template.officialLink),
      votes: votes.has(template.name) ? votes.get(template.name) : null,
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

/** 👍 reactions on the submission issue, counted once per account. */
async function countUpvotes(repository, issueNumber, githubToken) {
  const users = new Set();
  let url = `https://api.github.com/repos/${repository}/issues/${issueNumber}/reactions?content=%2B1&per_page=100`;
  for (let page = 0; page < 5 && url; page += 1) {
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
      console.warn(`Votes for #${issueNumber} could not be read: ${error.message}`);
      return null;
    }
    if (!response.ok) {
      console.warn(`Votes for #${issueNumber} could not be read: HTTP ${response.status}`);
      return null;
    }
    const items = await response.json();
    for (const item of items) if (item?.user?.login) users.add(String(item.user.login).toLowerCase());
    url = nextPage(response.headers.get("link"));
  }
  return users.size;
}

function nextPage(link) {
  if (!link) return null;
  const match = /<([^>]+)>;\s*rel="next"/u.exec(link);
  return match ? match[1] : null;
}
