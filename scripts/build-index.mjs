#!/usr/bin/env node
// Builds the data the site renders: every template, its official id and its derived deep link.
//
//   node scripts/build-index.mjs
//
// There is no vote count here on purpose. A count has to come from something a contributor cannot
// re-point at another template, and an issue number inside a JSON file is not that: the author of an
// old submission can edit its link field, and a pull request can name that issue. A counter that can
// be borrowed is worse than no counter, so the card shows none until the link between a template and
// its submission can be proven (see README, "Implementation notes").

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

const { results, failed } = await validateTemplates(templatesDir, { checkLinks: false });
if (failed > 0) {
  for (const result of results) {
    for (const problem of result.problems) console.error(`${result.name}: ${problem.field}: ${problem.message}`);
  }
  console.error(`\n${failed} template(s) are invalid. Fix them before building.`);
  process.exit(1);
}

const templates = results
  .map(({ template }) => ({
    ...template,
    id: templateId(template.officialLink),
    deepLink: deepLink(template.officialLink),
  }))
  .sort((left, right) => {
    if (left.status !== right.status) return left.status === "published" ? -1 : 1;
    return nameKey(left.name).localeCompare(nameKey(right.name));
  });

await mkdir(outDir, { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  repo,
  templates,
};
await writeFile(join(outDir, "templates.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const published = templates.filter((template) => template.status === "published").length;
console.log(`${templates.length} template(s) indexed, ${published} published.`);
console.log(`Wrote ${join("site", "src", "data", "templates.json")}.`);
