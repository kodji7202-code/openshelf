#!/usr/bin/env node
// One install archive per template: `downloads/<slug>.zip` with `openbot-import.json` at its root.
//
//   node scripts/build-zips.mjs
//
// The archive is the install path OpenShelf serves: the reader downloads it and imports it in
// OpenBot from Settings → Import. It holds no secrets and no workspace files, only the profile the
// template already publishes.

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { manifestFor, readmeFor } from "./lib/import-manifest.mjs";
import { validateTemplates } from "./lib/validate.mjs";
import { writeStoredZip } from "./lib/zip.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const templatesDir = join(root, "templates");
const outDir = join(root, "site", "public", "downloads");

const { results, failed } = await validateTemplates(templatesDir, { checkLinks: false });
if (failed > 0) {
  console.error(`${failed} template(s) are invalid; no archives were written.`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const exportedAt = new Date().toISOString();
for (const { template } of results) {
  const archive = writeStoredZip([
    { name: "openbot-import.json", data: `${JSON.stringify(manifestFor(template, exportedAt), null, 2)}\n` },
    { name: `agents/${template.slug}/README.txt`, data: readmeFor(template) },
  ]);
  await writeFile(join(outDir, `${template.slug}.zip`), archive);
}

console.log(`${results.length} install archive(s) written to ${join("site", "public", "downloads")}.`);
