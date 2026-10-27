# What an OpenBot agent template actually contains

Step 1 of the plan: confirm the real fields before freezing our schema. This note records what was
read from the product, so a reviewer can check the mapping instead of trusting it.

## How the export was read

Two sources, both real:

1. `openbot.read_agent` on a live agent of this server (Dev). It returns the profile the app stores:
   `id, name, title, description, provider, model, reasoningEffort, providerAccountId, backupModels,
   usageLimitReturn, access, computerUse, notifications, autoApprove, skills[], routines[],
   mcpServers[]`. `description` is what the UI calls **Instructions**.
2. The published-template contract in the app source
   (`packages/contracts/src/ipc-agent-templates.ts`, shipped in OpenBot 0.5x):
   `AgentTemplateSnapshot = { name, title, description, avatarSeed, avatarHue, skills[], routines[] }`,
   plus `id, avatarUrl, cardUrl, creatorName, updatedAt` on the detail route.

A real **publish** was not performed: publishing makes the agent public on `openbot.run` and is an
external action nobody approved. Nothing in this repository depends on one.

## The template, field by field

| Template field | Comes from | Notes |
| --- | --- | --- |
| `name` | agent name | ≤ 80 characters (`INPUT_LIMITS.agentName`) |
| `title` | agent title | ≤ 120 |
| `description` | agent instructions | ≤ 2000, must not be empty |
| `avatarSeed` | derived from the name/avatar | pattern `^[a-z0-9:-]{1,128}$` |
| `avatarHue` | the avatar colour | one of 0/30/55/100/150/185/215/245/280/320, or null |
| `skills[]` | installed skills | ≤ 32; a marketplace skill is a **reference** (`skillId, versionId, slug, name, version`), a local skill is its `SKILL.md` text only (`slug, name, markdown`, ≤ 64 KB each, ≤ 10 embedded) |
| `routines[]` | the agent's routines | ≤ 64; `{ name, instruction, active, schedule }` |
| `id` | assigned by the account service | 22 characters, base64url |
| `avatarUrl`, `cardUrl` | account service (R2) | card is a 1200×630 PNG, used as `og:image` |

Whole snapshot JSON ≤ 1 000 000 bytes. Schedules are the released routine union —
`hourly | daily | weekdays | weekly | monthly | interval | advanced | custom`; a one-time (`once`)
schedule stays on the computer that made it and cannot travel in a template.

## What a template does **not** carry

Verified against the contract and `docs/architecture/agents.md` ("Agent templates"): no provider, no
model, no reasoning effort, no workspace files, no memories, no MCP configuration, no access or
Computer Use setting, no chat history, no channel membership. Those live on the host that installs
it, or arrive through the separate `.zip` formats (agent import, instance transfer).

Consequences for this directory:

- A card can promise **what the agent is told to do** (instructions, skills, routines) and nothing
  about which model runs it.
- The number of templates one account may publish is **5**, so a large directory cannot rely on
  official links alone. The directory therefore stays a link index; it never mirrors exports.
- An installation always needs one press in the app. The link opens a preview; it installs nothing.

## The link

`https://openbot.run/agents/<id>` is the share page, `openbot://agents/<id>` is the same preview in
the desktop app, and `/app?agent=<id>` is the browser client. The parser accepts only that origin,
with no query, hash, port or userinfo. Ids are 22 URL-safe characters. We store the `https` form and
derive the `openbot://` form at build time.

## What OpenShelf stores per template

Only what a reader needs to decide, never the agent: name, tagline, description, category, tags,
language, the agent's title/instructions/skills-count/routines-count as shown on its page, the
official link, creator credit, requirements, dates, status. `schema/template.schema.json` is the
authority; `validate.mjs` enforces it plus the rules a schema cannot express (file name equals slug,
one entry per official link, no secrets, no HTML).
