// The generated data, checked again when the site builds.
//
// `schema/template.schema.json` and `scripts/validate.mjs` are the authority on what may be
// published; this module is the second lock, so a broken generator cannot ship a page with a
// missing field. It runs at build time and throws, which fails `astro build` before deploy.

import { z } from "zod";
import payload from "../data/templates.json";
import { translator, type Locale } from "../i18n";

const text = z.string().min(1);

const templateSchema = z
  .object({
    schemaVersion: z.literal(1),
    slug: z.string().regex(/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){2,59}$/u),
    name: text.max(60),
    tagline: text.max(140),
    description: text.max(2000),
    category: z.enum(["research", "dev", "media", "business", "ops", "personal", "other"]),
    tags: z.array(text).max(6),
    language: z.string().regex(/^[a-z]{2}(?:-[A-Za-z]{2})?$/u),
    agent: z.object({
      title: z.string().max(120),
      description: text.max(2000),
      skills: z.array(z.string()).max(32),
      routines: z.boolean(),
    }),
    officialLink: z.string().regex(/^https:\/\/openbot\.run\/agents\/[A-Za-z0-9_-]{22}$/u).optional(),
    creator: z.object({ name: text.max(60), github: text.max(39) }),
    requires: z
      .object({
        tools: z.array(z.enum(["browser", "computer-use", "github", "web-search", "files", "shell"])).max(6),
        notes: z.string().max(500).optional(),
      })
      .optional(),
    submittedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    status: z.enum(["published", "delisted"]),
    id: z.string().length(22).nullable(),
    deepLink: z.string().regex(/^openbot:\/\/agents\/[A-Za-z0-9_-]{22}$/u).nullable(),
  })
  .strict();

const payloadSchema = z
  .object({
    generatedAt: z.string(),
    repo: z.string(),
    templates: z.array(templateSchema),
  })
  .strict();

const parsed = payloadSchema.safeParse(payload);
if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`site/src/data/templates.json is invalid:\n${details}`);
}

export type Template = z.infer<typeof templateSchema>;

export const generatedAt = parsed.data.generatedAt;
export const repo = parsed.data.repo;
export const templates: Template[] = parsed.data.templates;
export const published = templates.filter((template) => template.status === "published");
export const delisted = templates.filter((template) => template.status === "delisted");

export const CATEGORY_IDS = ["research", "dev", "media", "business", "ops", "personal", "other"] as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  ro: "Română",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  uk: "Українська",
};

export function languageName(code: string, locale: Locale = "en"): string {
  if (code === "en" || code === "es") return translator(locale)(`locale.${code}` as never);
  return LANGUAGE_NAMES[code] ?? code.toUpperCase();
}

export function categoryName(code: string, locale: Locale = "en"): string {
  return translator(locale)(`category.${code}` as never);
}

/** The languages that actually have a card, so the filter never offers an empty choice. */
export function languagesInUse(): string[] {
  return [...new Set(published.map((template) => template.language))].sort();
}

export function categoriesInUse(): string[] {
  return CATEGORY_IDS.filter((code) => published.some((template) => template.category === code));
}

export function repoUrl(path = ""): string {
  return `https://github.com/${repo}${path}`;
}
