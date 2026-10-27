#!/usr/bin/env node
// Reads the built site and refuses what the tests cannot see: a wrong locale link, a missing
// translation, a vote promise the catalog does not keep, or a card without an install path.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "site", "dist");
const base = "/openshelf";

const read = async (path) => {
  const file = join(dist, path);
  assert.ok(existsSync(file), `missing page: ${path}`);
  return readFile(file, "utf8");
};

const en = await read("index.html");
assert.match(en, /<html lang="en"/u);
assert.match(en, /href="\/openshelf\/es\/"/u, "the English page must switch to /es/");
assert.match(en, /hreflang="es" href="https:\/\/[^"]*\/openshelf\/es\/"/u, "hreflang must keep the base");
assert.equal((en.match(/class="card"/gu) ?? []).length, 13, "the catalog must list 13 cards");
assert.equal(
  (en.match(/href="https:\/\/openbot\.run\/agents\/[A-Za-z0-9_-]{22}"/gu) ?? []).length,
  5,
  "five cards have an official template",
);
assert.equal(
  (en.match(/href="\/openshelf\/downloads\/[a-z0-9-]+\.zip"/gu) ?? []).length,
  8,
  "eight cards download an archive",
);
assert.match(en, /data-theme-toggle/u, "the theme switch is part of the shell");

const es = await read("es/index.html");
assert.match(es, /<html lang="es"/u);
assert.match(es, /href="\/openshelf\/"/u, "the Spanish page must switch back to the English home");
assert.match(es, /Plantillas de agentes/u);
assert.equal((es.match(/class="card"/gu) ?? []).length, 13);
assert.match(es, /href="\/openshelf\/es\/t\/dev\/"/u, "Spanish cards link to Spanish details");

const enPrivacy = await read("privacy/index.html");
assert.match(enPrivacy, /DRAFT/u);
assert.match(enPrivacy, /href="\/openshelf\/es\/privacy\/"/u, "switch keeps the page");
assert.doesNotMatch(enPrivacy.replace(/<[^>]+>/gu, " "), /\bvotos?\b/iu, "privacy must not promise votes");

const esTerms = await read("es/terms/index.html");
assert.match(esTerms, /BORRADOR/u);
assert.doesNotMatch(esTerms.replace(/<[^>]+>/gu, " "), /\bvotos?\b/iu, "terms must not promise votes");

const esDetail = await read("es/t/dev/index.html");
assert.match(esDetail, /Instalación/u);
assert.match(esDetail, /https:\/\/openbot\.run\/agents\/fBREHOr3tMHeb53_rzzubw/u);
assert.match(esDetail, new RegExp(`href="${base}/downloads/dev\\.zip"`, "u"));

const enDetail = await read("t/ghost/index.html");
assert.match(enDetail, /Installation/u);
assert.match(enDetail, new RegExp(`href="${base}/downloads/ghost\\.zip"`, "u"));

console.log("site check: 9 page assertions passed.");
