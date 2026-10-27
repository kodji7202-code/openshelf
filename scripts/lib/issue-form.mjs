// Turns a GitHub Issue Form body into a template file. Pure: no shell, no network, no eval.
//
// The body is untrusted text written by anyone with a GitHub account. It is only ever split,
// trimmed, and serialised with JSON.stringify by the caller, so markdown, HTML, `$(...)`, backticks
// and newlines stay literal characters of a string value.

import { OFFICIAL_LINK, SLUG, slugify, templateId } from "./rules.mjs";

/** The headings the issue form writes. The first occurrence wins; unknown headings are ignored. */
const LABELS = {
  link: "Official template link",
  name: "Name",
  tagline: "Tagline",
  description: "Description",
  category: "Category",
  tags: "Tags",
  language: "Language",
  agentTitle: "Agent title",
  agentDescription: "Agent instructions",
  skills: "Skills",
  routines: "Routines",
  requirements: "Requirements",
  creator: "Creator name",
  // Boundaries only: the checkbox group ends the section before it. Nothing reads its value.
  confirmations: "Confirmations",
};

const CATEGORIES = new Set(["research", "dev", "media", "business", "ops", "personal", "other"]);
const KNOWN_LABELS = new Set(Object.values(LABELS));
const TOOLS = new Set(["browser", "computer-use", "github", "web-search", "files", "shell"]);
const TOOL_ALIASES = {
  browser: "browser",
  "computer use": "computer-use",
  "computer-use": "computer-use",
  github: "github",
  "web search": "web-search",
  "web-search": "web-search",
  files: "files",
  file: "files",
  shell: "shell",
  terminal: "shell",
};

/** Splits a form body on the headings the form writes. A heading counts once: a repeated one is
 * ordinary text, so a value that contains "### Official template link" cannot truncate a field. */
export function parseIssueForm(body) {
  const sections = new Map();
  const seen = new Set();
  const lines = String(body ?? "").split(/\r?\n/u);
  let heading = null;
  let buffer = [];
  const flush = () => {
    if (heading !== null && !sections.has(heading)) sections.set(heading, buffer.join("\n").trim());
    buffer = [];
  };
  for (const line of lines) {
    const match = /^###\s+(.{1,120})\s*$/u.exec(line);
    const label = match?.[1]?.trim();
    if (label && KNOWN_LABELS.has(label) && !seen.has(label)) {
      flush();
      seen.add(label);
      heading = label;
      continue;
    }
    if (heading !== null) buffer.push(line);
  }
  flush();
  return sections;
}

/** The checkbox lines a submitter ticked, as their label text. */
export function checkedConfirmations(body) {
  const checked = [];
  for (const line of String(body ?? "").split(/\r?\n/u)) {
    const match = /^\s*-\s*\[[xX]\]\s*(.+?)\s*$/u.exec(line);
    if (match) checked.push(match[1]);
  }
  return checked;
}

function oneLine(value) {
  return String(value ?? "")
    .replace(/\s+/gu, " ")
    .trim();
}

function list(value) {
  return String(value ?? "")
    .split(/[,\n]/u)
    .map((item) => oneLine(item))
    .filter(Boolean);
}

function today(now) {
  return new Date(now).toISOString().slice(0, 10);
}

/**
 * @param {{ body: string, issueNumber: number, author: string, now?: Date }} input
 * @returns {{ template: object, slug: string, warnings: string[] }}
 * @throws when the submission cannot become a template, with a reason a moderator can read.
 */
export function draftFromIssue({ body, issueNumber, author, now = new Date() }) {
  const sections = parseIssueForm(body);
  const get = (key) => sections.get(LABELS[key]) ?? "";
  const warnings = [];
  const fail = (message) => {
    throw new Error(message);
  };

  const confirmations = checkedConfirmations(body).join(" \n ").toLowerCase();
  for (const required of ["author", "secrets", "terms"]) {
    if (!confirmations.includes(required))
      fail("nu ai bifat toate confirmările obligatorii (autor, fără secrete, termeni)");
  }

  const officialLink = oneLine(get("link"));
  if (!OFFICIAL_LINK.test(officialLink))
    fail("linkul oficial nu e un șablon publicat: trebuie să arate ca https://openbot.run/agents/<22 de caractere>");
  const id = templateId(officialLink);

  const name = oneLine(get("name"));
  const slug = slugify(name);
  if (!SLUG.test(slug)) fail("din nume nu iese un slug de 3 pînă la 60 de caractere; folosește litere și cifre");

  const tagline = oneLine(get("tagline"));
  const description = get("description").trim();
  if (!tagline) fail("tagline-ul e gol");
  if (!description) fail("descrierea e goală");

  const agentDescription = get("agentDescription").trim() || description;
  const categoryRaw = oneLine(get("category")).toLowerCase();
  const category = CATEGORIES.has(categoryRaw) ? categoryRaw : "other";
  if (categoryRaw && !CATEGORIES.has(categoryRaw)) warnings.push(`unknown category "${categoryRaw}", saved as "other"`);

  const tags = [...new Set(list(get("tags")).map(slugify).filter(Boolean))];
  if (tags.length === 0) fail("at least one tag is required");
  // Refuse, do not trim: a contributor who wrote seven tags must decide which one to drop.
  if (tags.length > 6) fail(`ai ${tags.length} tag-uri, iar limita este 6`);

  const languageRaw = oneLine(get("language")).toLowerCase();
  const language = /^[a-z]{2}(?:-[a-z]{2})?$/u.test(languageRaw) ? languageRaw : "en";
  if (languageRaw && language !== languageRaw) warnings.push(`language "${languageRaw}" saved as "en"`);

  const skills = [...new Set(list(get("skills")).map(slugify).filter(Boolean))];
  if (skills.length > 32) fail("ai mai mult de 32 de skilluri");

  const tools = [];
  for (const item of list(get("requirements"))) {
    const tool = TOOL_ALIASES[item.toLowerCase()];
    if (tool && !tools.includes(tool)) tools.push(tool);
    else if (!tool && item) warnings.push(`requirement "${item}" is not one of the known tools and was dropped`);
  }

  const github = oneLine(author);
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/u.test(github))
    fail("numele de utilizator GitHub al trimitătorului nu e utilizabil");

  const template = {
    schemaVersion: 1,
    slug,
    name,
    tagline,
    description,
    category,
    tags,
    language,
    agent: {
      title: oneLine(get("agentTitle")) || name,
      description: agentDescription,
      skills,
      routines: /^(y|yes|true|da|1)\b/iu.test(oneLine(get("routines"))),
    },
    officialLink,
    creator: { name: oneLine(get("creator")) || github, github },
    ...(tools.length > 0 ? { requires: { tools } } : {}),
    submittedAt: today(now),
    updatedAt: today(now),
    status: "published",
  };

  if (!/^[\x20-\x7E\p{L}\p{N}]+$/u.test(officialLink) || id === null) fail("linkul oficial nu e utilizabil");

  return { template, slug, warnings };
}

/** The exact bytes of `templates/<slug>.json`. The workflow writes this, never a shell echo. */
export function renderTemplateFile(template) {
  return `${JSON.stringify(template, null, 2)}\n`;
}
