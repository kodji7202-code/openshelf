// The `openbot-import.json` an OpenShelf download carries. Kept beside the schema so the tests and
// the build write the same manifest, and so the format is named in one place.

export const IMPORT_FORMAT = "openbot-agent-import";
export const IMPORT_VERSION = 1;

export function manifestFor(template, exportedAt = new Date().toISOString()) {
  return {
    format: IMPORT_FORMAT,
    version: IMPORT_VERSION,
    source: { app: "OpenShelf", exportedAt },
    agents: [
      {
        key: template.slug,
        name: template.name,
        title: template.agent.title || template.name,
        description: template.agent.description,
        avatar: null,
        skills: [],
        files: null,
        routines: [],
        memories: [],
      },
    ],
    channels: [],
  };
}

export function readmeFor(template) {
  return [
    `${template.name} — an OpenShelf template for OpenBot.`,
    "",
    "Import: OpenBot → Settings → Import → choose this .zip file.",
    "The import creates the agent locally and leaves your other agents alone.",
    "",
    "Instructions are the author's text, imported as-is.",
    template.officialLink ? `Official template page: ${template.officialLink}` : "",
    "",
  ].join("\n");
}

/**
 * What OpenBot refuses at import, mirrored here so a broken archive fails `npm test` instead of the
 * reader's Settings screen. Only the rules the archives we write can break: format, version, one
 * agent with bounded text, and paths that stay inside their agent folder.
 */
export function manifestProblems(manifest) {
  const problems = [];
  if (manifest?.format !== IMPORT_FORMAT) problems.push(`format is not ${IMPORT_FORMAT}`);
  if (manifest?.version !== IMPORT_VERSION) problems.push(`version is not ${IMPORT_VERSION}`);
  if (!Array.isArray(manifest?.agents) || manifest.agents.length === 0) problems.push("no agents");
  for (const agent of manifest?.agents ?? []) {
    if (typeof agent?.key !== "string" || !/^[a-z0-9][a-z0-9-]{2,59}$/u.test(agent.key))
      problems.push(`agent key is not a slug: ${agent?.key}`);
    if (typeof agent?.name !== "string" || !agent.name.trim() || agent.name.length > 80)
      problems.push(`${agent?.key}: name is empty or too long`);
    if (typeof agent?.title !== "string" || agent.title.length > 120)
      problems.push(`${agent?.key}: title is too long`);
    if (typeof agent?.description !== "string" || !agent.description.trim() || agent.description.length > 2000)
      problems.push(`${agent?.key}: description is empty or too long`);
    const paths = [agent?.avatar, agent?.files, ...(agent?.skills ?? [])].filter(Boolean);
    for (const path of paths)
      if (!String(path).startsWith(`agents/${agent.key}/`) || String(path).includes(".."))
        problems.push(`${agent.key}: path escapes its folder: ${path}`);
  }
  return problems;
}
