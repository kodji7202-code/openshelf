# OpenShelf

A community directory of agent templates published on OpenBot (`openbot.run`). One JSON file per
template, a static Astro site generated from them, and GitHub as the whole backend: issue form →
pull request → review → merge → deploy.

**Live site:** https://kodji7202-code.github.io/openshelf/

> Independent community project. Not affiliated with, endorsed by, or sponsored by OpenBot or
> Synthetify Labs sp. z o.o. "OpenBot" is used descriptively, to name the platform the templates are
> for. See [DISCLAIMER.md](DISCLAIMER.md).

## Why it is built this way

An OpenBot agent template is a **link-only public page** at `https://openbot.run/agents/<id>`, served
by OpenBot itself. The app opens it as a preview, and installation is one press of **Install** there.
That decides the whole architecture:

| Constraint (verified in OpenBot) | What it means here |
| --- | --- |
| Templates live on `openbot.run`, ids are minted by OpenBot | The directory stores links and descriptions, never agent exports |
| A link opens a preview and installs nothing | There is no "install from our site" button, and we do not pretend otherwise |
| One account may publish 5 templates | A large catalogue cannot be all-official-links; entries are curated, not bulk-imported |
| No listing API for templates (link-only by design) | The index is this repository, not an upstream feed |
| Templates carry no provider, model, workspace or memories | Cards describe instructions, skills and routines, and promise nothing about the model |

The full field-by-field evidence is in [schema/NOTES.md](schema/NOTES.md).

## Repository layout

```
templates/<slug>.json        one template per file, the source of truth
schema/template.schema.json  JSON Schema (draft 2020-12), the authority on shape
schema/NOTES.md              the real OpenBot template fields, with sources
scripts/validate.mjs         schema + rules + duplicates + secrets + link check
scripts/build-index.mjs      builds the site data, reads 👍 votes from GitHub
scripts/issue-to-pr.mjs      issue form → templates/<slug>.json → pull request
scripts/linkcheck.mjs        weekly link check, delists after two failures
site/                        Astro, static, no framework on the client
tests/                       fixtures and the tests that must pass before a merge
state/link-health.json       consecutive failures per template
legal/                       draft terms and privacy policy (not in force yet)
```

## Implementation notes

Where this repository departs from `DESIGN.md`, and why:

- **No Astro content collections.** The templates are generated data, not authored content, so the
  site imports one generated `site/src/data/templates.json`. `schema/template.schema.json` + `ajv`
  stays the single authority on shape; `site/src/lib/templates.ts` re-checks the file with `zod` at
  build time as a second lock. Two schemas describing the same fields would drift.
- **The link check runs before the pull request exists.** The submission workflow validates the
  generated file with `--links`, so a submission whose official link answers 404 never opens a pull
  request. `validate.yml` stays the gate for changes made directly as pull requests.
- **A bot-created pull request may need one approval click.** GitHub does not run `pull_request`
  workflows for a pull request opened with `GITHUB_TOKEN`; the run appears as `action_required`. The
  validation that matters already ran in the submission job, and a maintainer's click starts the
  rest. Pull requests from people run automatically.
- **No vote counter yet.** The submission issue number would sit in a file a contributor can edit, so
a count could be borrowed from an old issue with reactions. Until the template-to-issue link can be
proven, the site shows no counter at all; README's "Votes" section lists the two ways to bring it
back.
- **A branch is never forced.** Each submission gets its own `submit/<issue>-<slug>` branch. If it
  already exists, the workflow refuses to rebuild it, because it may hold a moderator's corrections,
  and comments that a person has to act.
- **A delisted template is not gated on its link.** Admission checks the link of a published
  template; a broken link is why a template is delisted, and the weekly job watches the rest. Deploys
  do not check links at all, so an outage elsewhere cannot block an unrelated change.

## Local development

```bash
npm ci
npm test                     # fixture tests, no network
node scripts/validate.mjs    # schema and rules
node scripts/validate.mjs --links   # also fetch every official link
npm --prefix site ci
npm run build                # builds site/src/data/templates.json, then the site
npm --prefix site run dev    # preview at http://localhost:4321/openshelf/
```

`npm run build` fails before Astro runs if any template is invalid, so a broken card cannot deploy.

## How a template gets in

1. The author publishes the agent in OpenBot (**Publish** in the chat header) and copies
   `https://openbot.run/agents/<id>`.
2. The author fills the [submission form](.github/ISSUE_TEMPLATE/submit-template.yml).
3. The `submission` workflow turns it into `templates/<slug>.json` and opens one pull request. The
   issue body is parsed as text, serialised with `JSON.stringify`, and never reaches a shell.
4. `validate.yml` checks the schema, the rules, duplicates, credentials and the link (HTTP 200), then
   builds the site.
5. A maintainer reviews the official page and merges. Only then does the card appear.

`status: delisted` is how a template leaves the list; its page stays, marked as delisted. The weekly
link check opens that pull request on its own when a link fails twice in a row.

## Votes

There are none, and that is a decision, not an omission. A vote count would have to come from
something a contributor cannot re-point at another template. An issue number in a JSON file is not
that: the author of an old submission can edit its link field, and a pull request can name that old
issue, so a counter could be borrowed along with its reactions. A counter that can be forged is worse
than no counter.

Bringing votes back needs one of these, and neither is in place:

- pull requests opened with a token of their own, so the workflow can prove the head branch
  `submit/<issue>-<slug>` and read reactions from the pull request instead of an editable issue;
- a submissions index the bot writes and a moderator merges, with the template id in it, so the
  template-to-issue link is not contributor-editable.

Until then, cards are ordered by the author's name, published first.

## Licences

| Area | Licence | File |
| --- | --- | --- |
| Site, scripts, workflows | MIT | [LICENSE](LICENSE) |
| `templates/**` (the contributed text) | CC BY 4.0 | [templates/LICENSE](templates/LICENSE), [LICENSES/CC-BY-4.0.txt](LICENSES/CC-BY-4.0.txt) |
| `legal/**` (drafts) | CC BY 4.0 | [legal/](legal/) |

Reusing a template means crediting its author, linking to the licence, and stating what you changed.
The author of a template keeps the copyright and is credited on its page. Contributions come in under
the same licence as the area they land in (GitHub Terms of Service, section D.6), so there is no CLA;
[CONTRIBUTING.md](CONTRIBUTING.md) asks for a written representation of rights instead.

## Privacy

The site sets no cookies and loads no analytics. Hosting is GitHub Pages, which receives the visitor's
IP address as any web server does. A submission happens on GitHub, under the submitter's account; the
catalogue publishes the chosen display name and the GitHub handle, never an email address. The draft
policy is [legal/PRIVACY.md](legal/PRIVACY.md).
