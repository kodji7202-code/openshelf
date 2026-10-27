# Contributing

Thanks for adding to the shelf. Two ways to help: submit a template, or improve the site.

## Submit a template

**You need a published template first.** OpenShelf only links to templates that exist on OpenBot, so
publish the agent there (in OpenBot: **Publish**, in the chat header) and copy the link
`https://openbot.run/agents/<id>`. Each OpenBot account can publish up to 5 templates; if you need
more, publish under another account or open a pull request that improves the directory instead.

Then open the [submission form](../../issues/new?template=submit-template.yml) and fill it in. What
happens next:

1. A workflow writes `templates/<slug>.json` and opens a pull request, then comments the link on your
   issue.
2. Validation runs: schema, slug equals file name, one entry per official link, one entry per name,
   no credentials, no invisible characters, and the official link must answer HTTP 200.
3. A maintainer opens your template page, reads the instructions, and merges or asks for changes.

Nothing is published without a merge. You can edit the issue afterwards; a maintainer can re-run the
workflow.

### What gets refused

- A link that is not `https://openbot.run/agents/<id>` — no other host, no shorteners, no query strings.
- Markup of any kind in a text field. Descriptions are plain text and are rendered as text.
- Credentials, tokens, keys, `.env` values, or personal data of other people.
- Copied instructions from another source without a licence that allows it.
- Names or descriptions that suggest an affiliation that does not exist (OpenBot, OpenAI, another
  product), or that imitate the interface of one.
- Duplicate names or duplicate official links.
- Templates whose instructions ask for data exfiltration, deception, or bypassing an approval step.

### Improving an existing entry

Open a pull request that edits `templates/<slug>.json`. Keep `slug` equal to the file name and keep
the JSON valid. If the author changed the agent, update `agent.description` and `updatedAt` in the
same pull request.

### Removing an entry

Anyone may ask; the author gets it by default. Open a pull request that sets `"status": "delisted"`
and say why in the description. The page stays online so old links keep explaining themselves.

## Rights and licence

By opening a pull request you agree that:

- You are the author of the text you submit, or you have written permission from whoever is, and you
  can license it under the licence of the area you are contributing to.
- Your contribution contains no secrets, no credentials, no personal data of third parties, and no
  material that infringes someone else's rights.
- You keep the copyright of your template and grant the project a worldwide, royalty-free,
  non-exclusive licence to host, display and technically adapt it so the catalogue can work.
- Your contribution arrives under the same licence as its area (GitHub Terms of Service, section D.6):
  **MIT** for code, **CC BY 4.0** for anything in `templates/`. No CLA is required.

## Work on the site

```bash
npm ci
npm test
node scripts/validate.mjs
npm --prefix site ci
npm run build
```

Rules that the build enforces, and that a reviewer will check again:

- No shell interpolation of untrusted text. In a workflow, pass an issue body through `env:`, never
  through `${{ }}` inside a script.
- Keep `GITHUB_TOKEN` permissions at the minimum each workflow needs.
- No new dependency unless it removes more code than it adds.
- The site must render without JavaScript: cards are server-rendered, filters only hide them.
- No analytics, no cookies, no third-party fonts or scripts.

## Reporting

Broken link, misleading card, rights problem, or a template that does something dangerous: open an
issue with the template slug and, if you can, the page you checked. Moderators can delist an entry
while the report is reviewed.
