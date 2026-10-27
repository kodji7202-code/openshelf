#!/usr/bin/env node
// Turns one submission issue into one pull request.
//
// The issue body arrives in ISSUE_BODY. It is parsed as text, serialised with JSON.stringify and
// written to templates/<slug>.json. It never reaches a shell, and no part of it becomes a git or gh
// argument except the slug, which must match ^[a-z0-9][a-z0-9-]{2,59}$ before it is used.

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { draftFromIssue, renderTemplateFile } from "./lib/issue-form.mjs";
import { commentOnIssue, configureGit, openPullRequest } from "./lib/git-pr.mjs";
import { SLUG } from "./lib/rules.mjs";
import { validateTemplates } from "./lib/validate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const templatesDir = join(root, "templates");

const body = process.env.ISSUE_BODY ?? "";
const issueNumber = Number(process.env.ISSUE_NUMBER ?? "");
const author = process.env.ISSUE_AUTHOR ?? "";
const repo = process.env.GITHUB_REPOSITORY ?? "";

if (!body || !Number.isInteger(issueNumber) || issueNumber < 1 || !author || !repo) {
  console.error("ISSUE_BODY, ISSUE_NUMBER, ISSUE_AUTHOR and GITHUB_REPOSITORY are required.");
  process.exit(2);
}

// A crash after this point would otherwise leave the issue with no answer at all.
process.on("unhandledRejection", (error) => {
  const message = String(error?.message ?? error).slice(0, 300);
  console.error(message);
  commentOnIssue({ repo, number: issueNumber, body: `Eroare în workflow: ${message}` });
  process.exit(1);
});

const say = (text) => console.log(text.replace(/\s+/gu, " ").slice(0, 400));

let draft;
try {
  draft = draftFromIssue({ body, issueNumber, author });
} catch (error) {
  say(`refused: ${error.message}`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: [
      "Nu am putut pregăti pull request-ul pentru această trimitere.",
      "",
      `Motiv: ${error.message}`,
      "",
      "Corectează issue-ul (îl poți edita) și un moderator îl poate relansa. Ghidul complet este în CONTRIBUTING.md.",
    ].join("\n"),
  });
  process.exit(0);
}

const { template, slug, warnings } = draft;
if (!SLUG.test(slug)) {
  console.error("the slug is not safe to use as a branch name");
  process.exit(2);
}

const file = join(templatesDir, `${slug}.json`);
if (existsSync(file)) {
  say(`templates/${slug}.json already exists`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: `Există deja un șablon cu slug-ul \`${slug}\` în catalog. Dacă vrei să îl actualizezi, deschide un pull request care modifică fișierul existent.`,
  });
  process.exit(0);
}

await writeFile(file, renderTemplateFile(template), "utf8");

const { failed, results } = await validateTemplates(templatesDir, { checkLinks: true });
if (failed > 0) {
  const problems = results.flatMap((result) =>
    result.problems.map((problem) => `- ${fieldLabel(problem.field)}: ${problem.message}`),
  );
  say(`invalid: ${problems.join(" | ")}`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: [
      "Fișierul generat nu trece validarea, deci nu am deschis un pull request.",
      "",
      ...problems.slice(0, 20),
      "",
      "Cauzele obișnuite: linkul oficial nu răspunde 200 (șablonul nu e publicat sau id-ul e greșit), un nume sau un link duplicat, sau un câmp cu markup.",
      "Textul de după două puncte este mesajul validatorului, în engleză.",
      "Corectează issue-ul și editează-l; un moderator poate relansa verificarea.",
    ].join("\n"),
  });
  process.exit(0);
}

configureGit();

const branch = `submit/${issueNumber}-${slug}`;
const title = `Template: ${template.name}`;
const prBody = [
  `Submission from #${issueNumber} by @${author}.`,
  "",
  `- Slug: \`${slug}\``,
  `- Official link: ${template.officialLink}`,
  `- Category: ${template.category} · language: ${template.language}`,
  "",
  "Generated from the issue form. The body was treated as text: nothing in it was executed.",
  "",
  "Reviewer checklist:",
  "- [ ] The official link opens a template whose instructions match this description",
  "- [ ] No secrets, no personal data, no third-party material without permission",
  "- [ ] Category, tags and language are fair",
  ...(warnings.length > 0 ? ["", "Warnings from the parser:", ...warnings.map((warning) => `- ${warning}`)] : []),
  "",
  `Closes #${issueNumber}`,
].join("\n");

const result = openPullRequest({
  branch,
  paths: [join("templates", `${slug}.json`)],
  message: `Add template ${slug}\n\nFrom #${issueNumber} by @${author}.`,
  title,
  body: prBody,
  repo,
});

if (result.existing) {
  say(`branch ${branch} already exists`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: `Există deja o ramură pentru acest issue (\`${branch}\`). Nu o suprascriu: poate conține corecții făcute de un moderator. Un moderator poate actualiza ramura sau deschide pull request-ul din ea.`,
  });
  process.exit(0);
}

if (!result.changed) {
  say("nothing to commit");
  commentOnIssue({
    repo,
    number: issueNumber,
    body: `Nu a fost nimic de comis: \`templates/${slug}.json\` există deja cu acest conținut.`,
  });
  process.exit(0);
}

if (result.url) {
  say(`opened ${result.url}`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: `Am deschis un pull request: ${result.url}\n\nValidarea automată rulează acolo; un moderator îl citește înainte de merge.`,
  });
} else {
  say(`pull request not opened: ${result.error ?? "unknown reason"}`);
  commentOnIssue({
    repo,
    number: issueNumber,
    body: [
      "Am generat fișierul, dar nu am putut deschide pull request-ul automat. Un moderator îl poate deschide din ramura `submit/" +
        slug +
        "`.",
      "",
      `Motiv tehnic: ${String(result.error ?? "necunoscut").slice(0, 300)}`,
    ].join("\n"),
  });
}

/** A field the contributor can recognise, so the refusal reads like a sentence and not like code. */
function fieldLabel(field) {
  const key = String(field ?? "")
    .replace(/^\//u, "")
    .replace(/\//gu, ".");
  const labels = {
    officialLink: "linkul oficial",
    slug: "slug-ul",
    name: "numele",
    tagline: "tagline-ul",
    description: "descrierea",
    category: "categoria",
    tags: "tag-urile",
    language: "limba",
    status: "statusul",
    submittedAt: "data trimiterii",
    updatedAt: "data actualizării",
    template: "fișierul",
    file: "fișierul",
    "agent.title": "titlul agentului",
    "agent.description": "instrucțiunile agentului",
    "agent.skills": "skill-urile",
    "creator.name": "numele autorului",
    "creator.github": "handle-ul GitHub al autorului",
    "requires.notes": "notițele despre cerințe",
  };
  return labels[key] ?? `câmpul ${key || "necunoscut"}`;
}
