#!/usr/bin/env node
// Validates templates/ (or any directory) and exits 1 on the first directory with a problem.
//
//   node scripts/validate.mjs            # schema and rules, no network
//   node scripts/validate.mjs --links    # also fetch every official link and require a 200
//   node scripts/validate.mjs --dir=tests/fixtures/valid

import { fileURLToPath } from "node:url";
import { validateTemplates } from "./lib/validate.mjs";

const args = process.argv.slice(2);
const checkLinks = args.includes("--links");
const dirArg = args.find((arg) => arg.startsWith("--dir="));
const dir = dirArg ? dirArg.slice("--dir=".length) : fileURLToPath(new URL("../templates/", import.meta.url));

const { results, failed } = await validateTemplates(dir, { checkLinks });

if (results.length === 0) {
  // A new directory starts empty. Say so loudly, but do not block a repository that has not been
  // seeded yet; the site renders an empty state.
  console.log(`No template files in ${dir}. Nothing to validate.`);
  process.exit(0);
}

for (const result of results) {
  if (result.problems.length === 0) {
    const votes = result.status === null ? "" : ` (link ${result.status})`;
    console.log(`ok    ${result.name}${votes}`);
    continue;
  }
  console.log(`FAIL  ${result.name}`);
  for (const problem of result.problems) console.log(`      ${problem.field || "template"}: ${problem.message}`);
}

console.log(`\n${results.length} template(s), ${failed} failed${checkLinks ? ", links checked" : ""}.`);
process.exit(failed === 0 ? 0 : 1);
