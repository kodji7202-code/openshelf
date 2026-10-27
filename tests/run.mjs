#!/usr/bin/env node
// The tests the reviewer and the tester can run without a network and without a GitHub account.
//
//   npm test

import { mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";
import { draftFromIssue, parseIssueForm, renderTemplateFile } from "../scripts/lib/issue-form.mjs";
import { slugify } from "../scripts/lib/rules.mjs";
import { validateTemplates } from "../scripts/lib/validate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmp = join(root, "tests", ".tmp");

let passed = 0;
const failures = [];

async function test(name, run) {
  try {
    await run();
    passed += 1;
    console.log(`ok    ${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.log(`FAIL  ${name}\n      ${error.message}`);
  }
}

await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });

await test("the three valid fixtures pass", async () => {
  const { results, failed } = await validateTemplates(join(root, "tests", "fixtures", "valid"));
  assert.equal(results.length, 3, "expected three fixtures");
  assert.equal(failed, 0, results.flatMap((r) => r.problems.map((p) => `${r.name}: ${p.message}`)).join("; "));
});

await test("each invalid fixture fails for its own documented reason", async () => {
  const { results, failed } = await validateTemplates(join(root, "tests", "fixtures", "invalid"));
  assert.equal(results.length, 5, "expected five fixtures");
  assert.equal(failed, 5, "every invalid fixture must fail");
  const reason = (name) => results.find((r) => r.name === name)?.problems.map((p) => `${p.field} ${p.message}`).join(" | ") ?? "";
  assert.match(reason("bad-link.json"), /officialLink .*openbot\.run/u);
  assert.match(reason("html-in-description.json"), /description/u);
  assert.match(reason("wrong-filename.json"), /slug .*must equal the file name/u);
  assert.match(reason("too-many-tags.json"), /tags/u);
  assert.match(reason("secret-leak.json"), /looks like a GitHub token/u);
});

await test("a slug is derived from a name with diacritics", async () => {
  assert.equal(slugify("Analist de date — rapoarte"), "analist-de-date-rapoarte");
  assert.equal(slugify("Ștefan & Co"), "stefan-co");
  assert.equal(slugify("  ---  "), "");
});

await test("more than six tags is refused, not trimmed", () => {
  const body = [
    "### Official template link",
    "https://openbot.run/agents/PPPPPPPPPPPPPPPPPPPPPP",
    "### Name",
    "Seven tags",
    "### Tagline",
    "x",
    "### Description",
    "x",
    "### Tags",
    "unu, doi, trei, patru, cinci, sase, sapte",
    "### Language",
    "en",
    "- [X] author",
    "- [X] secrets",
    "- [X] terms",
  ].join("\n");
  assert.throws(() => draftFromIssue({ body, issueNumber: 9, author: "kodji7202-code" }), /6/u);
});

await test("a realistic submission becomes a template that validates", async () => {
  const body = [
    "### Official template link",
    "https://openbot.run/agents/IIIIIIIIIIIIIIIIIIIIII",
    "### Name",
    "Verificator de surse",
    "### Tagline",
    "Verifică fiecare afirmație înainte s-o pună într-un raport.",
    "### Description",
    "Ia un text, găsește afirmațiile verificabile și leagă fiecare de o sursă primară.",
    "### Category",
    "research",
    "### Tags",
    "fact-check, surse",
    "### Language",
    "ro",
    "### Agent title",
    "Verificator de surse",
    "### Agent instructions",
    "Pentru fiecare afirmație dai sursa. Dacă nu găsești una, spui că nu ai găsit.",
    "### Skills",
    "source-check, quote-verify",
    "### Routines",
    "no",
    "### Requirements",
    "web-search, browser",
    "### Creator name",
    "Echipa OpenShelf",
    "### Confirmations",
    "- [X] I am the author or have permission (author)",
    "- [X] No secrets or personal data (secrets)",
    "- [X] I accept the terms (terms)",
  ].join("\n");

  const { template, slug } = draftFromIssue({ body, issueNumber: 42, author: "kodji7202-code" });
  assert.equal(slug, "verificator-de-surse");
  assert.deepEqual(template.agent.skills, ["source-check", "quote-verify"]);
  assert.deepEqual(template.requires.tools, ["web-search", "browser"]);
  assert.equal(template.status, "published");
  assert.equal("sourceIssue" in template, false, "a vote source is not part of the file");

  const file = join(tmp, `${slug}.json`);
  await writeFile(file, renderTemplateFile(template), "utf8");
  const { failed, results } = await validateTemplates(tmp);
  assert.equal(failed, 0, results.flatMap((r) => r.problems.map((p) => `${p.field}: ${p.message}`)).join("; "));
});

await test("hostile text stays inert and is refused by the rules", async () => {
  const body = [
    "### Official template link",
    "https://openbot.run/agents/JJJJJJJJJJJJJJJJJJJJJJ",
    "### Name",
    'Helper "><img src=x onerror=alert(1)>',
    "### Tagline",
    "Tries to inject",
    "### Description",
    "$(rm -rf /) `id` ${process.env.GITHUB_TOKEN}",
    "### Category",
    "other",
    "### Tags",
    "safety",
    "### Language",
    "en",
    "### Agent instructions",
    "Do the thing.\n### Official template link\nhttps://openbot.run/agents/KKKKKKKKKKKKKKKKKKKKKK",
    "### Confirmations",
    "- [X] author",
    "- [X] secrets",
    "- [X] terms",
  ].join("\n");

  const { template } = draftFromIssue({ body, issueNumber: 7, author: "kodji7202-code" });
  // The text is stored, never interpreted: no shell, no template literal, no interpolation.
  assert.match(template.description, /^\$\(rm -rf \/\) `id` \$\{process\.env\.GITHUB_TOKEN\}$/u);
  assert.equal(template.officialLink, "https://openbot.run/agents/JJJJJJJJJJJJJJJJJJJJJJ");
  // A repeated or unknown heading is ordinary text: it cannot truncate a field or add one.
  assert.match(template.agent.description, /Do the thing\.\n### Official template link\nhttps:\/\/openbot\.run\/agents\/KKKK/u);
  assert.match(template.name, /onerror=alert\(1\)/u);
  assert.equal(JSON.parse(renderTemplateFile(template)).name, template.name);

  // The schema, not the parser, refuses the markup: the workflow writes the file, validate.yml
  // fails the pull request, and nothing ever reaches the page.
  const dir = join(tmp, "hostile");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${template.slug}.json`), renderTemplateFile(template), "utf8");
  const { failed, results } = await validateTemplates(dir);
  assert.equal(failed, 1, "the hostile submission must not validate");
  assert.ok(
    results[0].problems.some((problem) => String(problem.field).includes("name")),
    `expected the name to be refused, got ${JSON.stringify(results[0].problems)}`,
  );
});

await test("a submission without the confirmations is refused", () => {
  const body = [
    "### Official template link",
    "https://openbot.run/agents/LLLLLLLLLLLLLLLLLLLLLL",
    "### Name",
    "No confirmations",
    "### Tagline",
    "x",
    "### Description",
    "x",
    "### Tags",
    "x",
    "### Language",
    "en",
  ].join("\n");
  assert.throws(() => draftFromIssue({ body, issueNumber: 1, author: "kodji7202-code" }), /confirmation/u);
});

await test("a lookalike host is refused before a file is written", () => {
  const body = [
    "### Official template link",
    "https://openbot.run.evil.com/agents/MMMMMMMMMMMMMMMMMMMMMM",
    "### Name",
    "Lookalike",
    "### Tagline",
    "x",
    "### Description",
    "x",
    "### Tags",
    "x",
    "### Language",
    "en",
    "- [X] author",
    "- [X] secrets",
    "- [X] terms",
  ].join("\n");
  assert.throws(() => draftFromIssue({ body, issueNumber: 1, author: "kodji7202-code" }), /official link/u);
});

await test("a heading is read once and unknown headings are ordinary text", () => {
  const sections = parseIssueForm("### Name\nFirst\n### Name\nSecond\n### Unknown\nignored");
  assert.equal(sections.get("Name"), "First\n### Name\nSecond\n### Unknown\nignored");
  assert.equal(sections.size, 1, "a repeated or unknown heading must not create a section");
  const next = parseIssueForm("### Name\nA\n### Unknown\nB\n### Tags\nC");
  assert.equal(next.get("Name"), "A\n### Unknown\nB");
  assert.equal(next.get("Tags"), "C");
});

await test("a duplicate official link is refused across files", async () => {
  const dir = join(tmp, "dupes");
  await mkdir(dir, { recursive: true });
  const base = {
    schemaVersion: 1,
    name: "Duplicate",
    tagline: "x",
    description: "x",
    category: "other",
    tags: ["x"],
    language: "en",
    agent: { title: "x", description: "x", skills: [], routines: false },
    officialLink: "https://openbot.run/agents/NNNNNNNNNNNNNNNNNNNNNN",
    creator: { name: "x", github: "kodji7202-code" },
    submittedAt: "2026-10-27",
    updatedAt: "2026-10-27",
    status: "published",
  };
  await writeFile(join(dir, "first.json"), JSON.stringify({ ...base, slug: "first" }), "utf8");
  await writeFile(join(dir, "second.json"), JSON.stringify({ ...base, slug: "second", name: "Duplicate two" }), "utf8");
  const { failed } = await validateTemplates(dir);
  assert.equal(failed, 1, "the second file must fail on the shared link");
});

await test("a file that parses to the wrong type is refused", async () => {
  const dir = join(tmp, "shapes");
  await mkdir(dir, { recursive: true });
  const shapes = { empty: "", null: "null", false: "false", zero: "0", string: '""', array: "[]" };
  for (const [name, body] of Object.entries(shapes)) await writeFile(join(dir, `${name}.json`), body, "utf8");
  const { results, failed } = await validateTemplates(dir);
  assert.equal(results.length, 6);
  assert.equal(failed, 6, results.map((result) => `${result.name}: ${result.problems.length}`).join(", "));
});

await test("a delisted template is not gated on its link, a published one is", async () => {
  const base = {
    schemaVersion: 1,
    name: "Link state",
    tagline: "x",
    description: "x",
    category: "other",
    tags: ["x"],
    language: "en",
    agent: { title: "x", description: "x", skills: [], routines: false },
    officialLink: "https://openbot.run/agents/OOOOOOOOOOOOOOOOOOOOOO",
    creator: { name: "x", github: "kodji7202-code" },
    submittedAt: "2026-10-27",
    updatedAt: "2026-10-27",
  };
  const gone = async () => ({ status: 404, body: null });

  const delistedDir = join(tmp, "link-delisted");
  await mkdir(delistedDir, { recursive: true });
  await writeFile(
    join(delistedDir, "gone.json"),
    JSON.stringify({ ...base, slug: "gone", status: "delisted" }),
    "utf8",
  );
  const delisted = await validateTemplates(delistedDir, { checkLinks: true, fetchImpl: gone });
  assert.equal(delisted.failed, 0, "a delisted template must not be refused for its dead link");

  const liveDir = join(tmp, "link-published");
  await mkdir(liveDir, { recursive: true });
  await writeFile(
    join(liveDir, "gone.json"),
    JSON.stringify({ ...base, slug: "gone", status: "published" }),
    "utf8",
  );
  const published = await validateTemplates(liveDir, { checkLinks: true, fetchImpl: gone });
  assert.equal(published.failed, 1, "a published template with a dead link must be refused");
});

await rm(tmp, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failures.length} failed.`);
if (failures.length > 0) {
  for (const failure of failures) console.error(`\n${failure.name}\n${failure.error.stack}`);
  process.exit(1);
}
