// One validator for `templates/**` and for the fixtures. The CLI in `scripts/validate.mjs` and the
// tests both call `validateTemplates`, so there is exactly one definition of "valid".

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { nameKey, templateId, templateRules } from "./rules.mjs";

const SCHEMA_PATH = new URL("../../schema/template.schema.json", import.meta.url);

let compiled = null;

async function validator() {
  if (compiled) return compiled;
  const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf8"));
  const instance = new Ajv2020({ allErrors: true, strict: false });
  compiled = instance.compile(schema);
  return compiled;
}

/** The .json files of a directory, sorted, so the output is stable between runs. */
export async function templateFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.startsWith("."))
    .map((entry) => join(dir, entry.name))
    .sort();
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  if (typeof value === "string") return `the string "${value.slice(0, 20)}"`;
  return `${typeof value} ${JSON.stringify(value)}`;
}

function ajvMessage(error) {
  const at = error.instancePath === "" ? "template" : error.instancePath.slice(1);
  if (error.keyword === "additionalProperties") return `${at}: unknown field "${error.params.additionalProperty}"`;
  if (error.keyword === "required") return `${at}: missing field "${error.params.missingProperty}"`;
  if (error.keyword === "enum") return `${at}: must be one of ${error.params.allowedValues.join(", ")}`;
  if (error.keyword === "pattern") return `${at}: has a shape the schema refuses`;
  if (error.keyword === "maxLength") return `${at}: longer than ${error.params.limit} characters`;
  if (error.keyword === "maxItems") return `${at}: more than ${error.params.limit} items`;
  if (error.keyword === "const") return `${at}: must be ${JSON.stringify(error.params.allowedValue)}`;
  return `${at}: ${error.message}`;
}

/**
 * Validates every file, then the rules that need all of them (one entry per official link, one
 * entry per name). `checkLinks` fetches each official link once and requires a 200.
 */
export async function validateTemplates(dir, { checkLinks = false, fetchImpl = fetch, timeoutMs = 10_000 } = {}) {
  const validate = await validator();
  const files = await templateFiles(dir);
  const results = [];

  for (const file of files) {
    const name = file.split(/[\\/]/u).at(-1);
    const problems = [];
    let template = null;
    let raw = "";
    try {
      raw = await readFile(file, "utf8");
    } catch (error) {
      problems.push({ field: "file", message: `cannot be read: ${error.message}` });
    }
    if (raw.trim() === "") problems.push({ field: "file", message: "is empty" });
    else if (raw) {
      let parsed;
      let wasJson = false;
      try {
        parsed = JSON.parse(raw);
        wasJson = true;
      } catch (error) {
        problems.push({ field: "file", message: `is not valid JSON: ${error.message}` });
      }
      // `null`, `false`, `0`, `""` and `[]` all parse. They are templates of the wrong type, not
      // templates without problems, so the schema runs on whatever came out of the parse.
      if (wasJson) {
        if (isPlainObject(parsed)) {
          template = parsed;
          if (!validate(parsed)) {
            for (const error of validate.errors ?? [])
              problems.push({ field: error.instancePath, message: ajvMessage(error) });
          }
          problems.push(...templateRules(parsed, { fileName: name }));
        } else {
          problems.push({
            field: "template",
            message: `must be a JSON object, not ${describe(parsed)}`,
          });
        }
      }
    }
    results.push({ file, name, template, problems, status: null });
  }

  const byLink = new Map();
  const byName = new Map();
  for (const result of results) {
    if (!result.template) continue;
    const id = templateId(result.template.officialLink);
    if (id && byLink.has(id))
      result.problems.push({
        field: "officialLink",
        message: `duplicates ${byLink.get(id)}: one official template may appear once`,
      });
    else if (id) byLink.set(id, result.name);
    const key = nameKey(result.template.name ?? "");
    if (key && byName.has(key))
      result.problems.push({ field: "name", message: `duplicates the name of ${byName.get(key)}` });
    else if (key) byName.set(key, result.name);
  }

  if (checkLinks) {
    const seen = new Map();
    for (const result of results) {
      // A delisted template is listed without its link working: that is why it was delisted. Link
      // health for the published ones is the weekly job's business, not this gate's.
      if (result.template?.status !== "published") continue;
      const id = templateId(result.template?.officialLink);
      if (!id) continue;
      if (!seen.has(id)) seen.set(id, await fetchStatus(result.template.officialLink, fetchImpl, timeoutMs));
      const status = seen.get(id);
      result.status = status;
      if (status !== 200)
        result.problems.push({
          field: "officialLink",
          message: status === null ? "could not be reached" : `answered ${status}, expected 200`,
        });
    }
  }

  return { results, failed: results.filter((result) => result.problems.length > 0).length };
}

async function fetchStatus(url, fetchImpl, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "openshelf-validator" },
    });
    await response.body?.cancel();
    return response.status;
  } catch {
    return null;
  }
}
