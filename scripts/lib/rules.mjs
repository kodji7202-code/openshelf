// Rules that a JSON Schema cannot express. Kept in its own module so the validator, the
// issue-to-PR workflow and the tests share one copy.

export const SLUG = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){2,59}$/u;
export const OFFICIAL_LINK = /^https:\/\/openbot\.run\/agents\/[A-Za-z0-9_-]{22}$/u;
export const TEXT_LIMITS = {
  name: 60,
  tagline: 140,
  description: 2_000,
  agentDescription: 2_000,
  notes: 500,
};

/** Invisible characters an editor cannot see but a reader pays for, including bidi overrides. */
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/u;

/**
 * Credential shapes. A submission is public the moment it merges, so a token pasted into a
 * description has to stop the build, not wait for a reviewer to notice it.
 */
const SECRETS = [
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/u],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/u],
  ["API key (sk-)", /\bsk-[A-Za-z0-9_-]{20,}\b/u],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/u],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/u],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/u],
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/u],
  ["JSON Web Token", /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\./u],
  ["bearer token", /\bBearer\s+[A-Za-z0-9._-]{20,}/u],
  [
    "named credential",
    /\b(?:api[_-]?key|secret|password|passwd|token)\b\s*[:=]\s*["']?[A-Za-z0-9_\-/+]{16,}/iu,
  ],
];

/** Every text field of a template, so a rule can run on all of them and name the one it hit. */
export function textFields(template) {
  const fields = [
    ["name", template?.name],
    ["tagline", template?.tagline],
    ["description", template?.description],
    ["agent.title", template?.agent?.title],
    ["agent.description", template?.agent?.description],
    ["requires.notes", template?.requires?.notes],
    ["creator.name", template?.creator?.name],
  ];
  const out = [];
  for (const [path, value] of fields) if (typeof value === "string") out.push([path, value]);
  for (const [index, tag] of (template?.tags ?? []).entries()) out.push([`tags[${index}]`, tag]);
  for (const [index, skill] of (template?.agent?.skills ?? []).entries())
    out.push([`agent.skills[${index}]`, skill]);
  return out;
}

/** Reasons a template cannot be published, each with the field it came from. */
export function templateRules(template, { fileName } = {}) {
  const problems = [];
  const add = (field, message) => problems.push({ field, message });

  if (fileName) {
    const expected = fileName.replace(/\.json$/u, "");
    if (template?.slug !== expected)
      add("slug", `the slug "${template?.slug}" must equal the file name "${expected}"`);
  }

  if (typeof template?.officialLink === "string" && !OFFICIAL_LINK.test(template.officialLink))
    add(
      "officialLink",
      "must be https://openbot.run/agents/<22 characters>; no other host, subdomain, port or query",
    );

  for (const [field, value] of textFields(template)) {
    if (INVISIBLE.test(value)) add(field, "contains an invisible or bidirectional control character");
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(value)) add(field, "contains a control character");
    if (value !== value.trim()) add(field, "has leading or trailing whitespace");
    if (/\r|\n{3,}/u.test(value) && field !== "agent.description" && field !== "description")
      add(field, "must be a single line");
    for (const [label, pattern] of SECRETS) if (pattern.test(value)) add(field, `looks like a ${label}`);
  }

  if (template?.creator?.github && /^[A-Za-z0-9-]+$/u.test(template.creator.github) === false)
    add("creator.github", "must be a GitHub handle");
  if (template?.submittedAt && template?.updatedAt && template.updatedAt < template.submittedAt)
    add("updatedAt", "cannot be earlier than submittedAt");

  return problems;
}

/** Case- and accent-insensitive key, so "Analist de date" and "analist de date" collide. */
export function nameKey(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .trim();
}

/** The id of a published template, or null when the link is not one. */
export function templateId(link) {
  return typeof link === "string" && OFFICIAL_LINK.test(link) ? link.split("/").at(-1) : null;
}

export function deepLink(link) {
  const id = templateId(link);
  return id ? `openbot://agents/${id}` : null;
}

/** A file name from a title: "Analist de date" -> "analist-de-date". */
export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 60)
    .replace(/-+$/u, "");
}
