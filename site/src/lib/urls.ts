// Astro gives BASE_URL without a trailing slash ("/openshelf"), so concatenating it directly makes
// "/openshelft/…". Every internal address goes through `href`, which guarantees exactly one slash.

const raw = import.meta.env.BASE_URL;

export const base = raw.endsWith("/") ? raw : `${raw}/`;

export function href(path = ""): string {
  return `${base}${String(path).replace(/^\/+/u, "")}`;
}
