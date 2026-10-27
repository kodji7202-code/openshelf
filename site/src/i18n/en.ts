// English, the default locale. Every visible string of the interface lives here, so a new locale is
// one file and one entry in `dictionaries` — no string is written inside a component.

export default {
  "page.title": "OpenShelf — agent templates for OpenBot",
  "page.description":
    "A community directory of agent templates for OpenBot (openbot.run). Each card links to the official template published by its author, or offers a .zip archive; installation happens in OpenBot.",
  "nav.home": "Catalog",
  "nav.about": "About",
  "nav.language": "Language",
  "locale.en": "English",
  "locale.es": "Spanish",
  "locale.switch.en": "Switch to English",
  "locale.switch.es": "Switch to Spanish",
  "nav.submit": "Submit a template",
  "theme.toDark": "Switch to dark theme",
  "theme.toLight": "Switch to light theme",
  "count.none": "No templates published yet.",
  "count.one": "1 published template.",
  "count.many": "{count} published templates.",
  "count.filtered": "{shown} of {total} templates.",
  "toolbar.label": "Search and filter",
  "search.label": "Search templates",
  "search.shortcut": "Ctrl K",
  "filter.language": "Instruction language",
  "filter.language.all": "All languages",
  "filter.category": "Category",
  "filter.category.all": "All",
  "filter.clear": "Clear filters",
  "card.details": "Details →",
  "a11y.newTab": "(opens openbot.run)",
  "card.install": "Install",
  "card.download": "Download .zip",
  "card.updated": "Updated {date}",
  "card.by": "by {name}",
  "empty.catalog.title": "The shelf is still empty.",
  "empty.catalog.body": "The catalog has no templates yet. Yours could be the first:",
  "empty.catalog.action": "Submit a template",
  "empty.filtered.title": "Nothing on this shelf.",
  "empty.filtered.body": "No templates match your search and selected filters.",
  "noscript":
    "Search and filters need JavaScript. Without it, all published templates are listed below.",
  "catalog.note":
    "A listing is not an endorsement. Download the archive or open the official template, read the agent's instructions, and decide whether to install it. Templates are written by independent authors, and OpenShelf does not test how they run.",
  "category.dev": "Development",
  "category.research": "Research",
  "category.media": "Media",
  "category.business": "Business",
  "category.ops": "Operations",
  "category.personal": "Personal",
  "category.other": "Other",
  "about.title": "About OpenShelf",
  "about.intro":
    "OpenShelf is a community directory of agent templates for OpenBot. It indexes and describes them so people can find them; installation happens in OpenBot, not here.",
  "about.not.title": "What OpenShelf is not",
  "about.not.affiliated":
    "OpenShelf is not affiliated with, endorsed by, or sponsored by OpenBot or Synthetify Labs sp. z o.o.",
  "about.not.hosted":
    "OpenShelf does not host agents. It serves a .zip archive with the template's public profile, and the file is imported in OpenBot.",
  "about.not.responsible":
    "OpenShelf is not responsible for what an agent does after installation. Read its instructions first.",
  "about.not.tracking":
    "OpenShelf has no account system, sets no cookies of its own, and does not track visitors.",
  "about.submit.title": "How a template gets listed",
  "about.submit.1":
    "Publish the agent in OpenBot using Publish in the chat header. Copy the link https://openbot.run/agents/<id>. One account may publish up to 5 agents.",
  "about.submit.2":
    "Open Submit a template and provide the link, name, description, category, tags, and language.",
  "about.submit.3":
    "A workflow turns the submission into a pull request with templates/<slug>.json. Form content is treated as text; nothing is executed.",
  "about.submit.4":
    "Automated checks validate the schema, official link (HTTP 200), duplicates, and possible secrets. A moderator then reviews and approves or declines the template.",
  "about.submit.note":
    "Nothing appears until an approved pull request is merged. A listing can be withdrawn through a pull request at the author's request or after an abuse report.",
  "about.votes.title": "Votes",
  "about.votes.body":
    "There are no votes. A counter would need a reliable link between a template and its submission that contributors cannot redirect. An issue number in a file is not enough; a counter that can be borrowed is worse than none. It can return when the link can be proven.",
  "about.licenses.title": "Licenses",
  "about.licenses.code": "Site code and scripts: MIT.",
  "about.licenses.templates": "Files in templates/: CC BY 4.0, with author attribution.",
  "about.licenses.legal":
    "Legal texts are drafts and do not take effect until entity details are completed.",
  "about.personal.title": "Personal data",
  "about.personal.body":
    "The site sets no cookies or analytics. GitHub Pages receives visitors' IP addresses as any web server does. Submissions go through GitHub under your account. The catalog publishes only your chosen name and GitHub handle, never your email.",
  "detail.back": "Catalog",
  "detail.updated": "Updated {date}",
  "detail.about": "What it does",
  "detail.contents": "What the agent contains",
  "detail.title": "Title",
  "detail.skills": "Skills",
  "detail.routines": "Routines",
  "detail.none": "none",
  "detail.routinesYes": "yes, the agent has scheduled routines",
  "detail.instructions": "Agent instructions",
  "detail.instructionsNote":
    "The text above is what the author published. It is shown as text, never interpreted.",
  "detail.install": "Installation",
  "detail.installOfficial": "Open the template in OpenBot ↗",
  "detail.officialNote":
    "The link opens the official template in OpenBot. Installation is a click on Install there; OpenShelf cannot install it for you.",
  "detail.installZip": "Download .zip",
  "detail.zipNote": "Or download the archive and import it from Settings → Import.",
  "detail.archiveNote":
    "The archive carries the template's public profile: name, title, instructions and routines, when present. It holds no workspace files, memories or secrets.",
  "detail.author": "Author",
  "detail.language": "Language",
  "detail.published": "Published",
  "detail.source": "Catalog file",
  "detail.report": "Something is wrong?",
  "detail.reportBody":
    "If a link is broken, an agent does something other than what is written here, or the content infringes rights,",
  "detail.reportAction": "open a report",
  "detail.reportTail": "Moderators can withdraw the template from the catalog.",
  "detail.delisted": "This template was withdrawn from the catalog.",
  "detail.requirements": "Requirements",
  "detail.noneRequired": "Nothing beyond OpenBot.",
  "import.title": "Import a template from a .zip file",
  "import.intro":
    "Download the archive, review the instructions, then import it in OpenBot. OpenShelf does not install it for you.",
  "import.step1": "1. Open Settings in OpenBot.",
  "import.step2": "2. Choose Import.",
  "import.step3": "3. Choose the .zip file you downloaded and follow OpenBot's prompts.",
  "import.caution":
    "Read the template and check what access its instructions request before importing.",
  "footer.tagline": "A community catalog of agent templates for OpenBot.",
  "footer.explore": "Explore",
  "footer.catalog": "Catalog",
  "footer.submit": "Submit a template",
  "footer.github": "GitHub",
  "footer.information": "Information",
  "footer.about": "About",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.disclaimer": "Disclaimer",
  "footer.source": "Source code",
  "footer.notAffiliated":
    "OpenShelf is an independent community project. It is not affiliated with, endorsed by, or sponsored by OpenBot or Synthetify Labs sp. z o.o. “OpenBot” is used descriptively to identify the platform these templates are for.",
  "footer.licenses":
    "Site code and scripts: MIT. Agent template files: CC BY 4.0, with attribution to each author.",
  "footer.draft": "Privacy and Terms are drafts and are not in force.",
  "footer.copyright": "Template authors retain copyright.",
  "legal.draft": "DRAFT — not in force",
  "legal.back": "Back to OpenShelf",
  "privacy.title": "Privacy policy — DRAFT",
  "privacy.description": "Privacy policy for OpenShelf. Draft, not in force.",
  "privacy.status":
    "Draft, not in force. Based on the legal review dated 2026-10-27; no controller is named yet. Fill every [placeholder] and obtain review before announcing the catalog. It describes current software behaviour; placeholders are for legal identity, not promises about behaviour. Not legal advice.",
  "privacy.1":
    "1. Controller — [Legal entity, form, registration number, address], [contact e-mail]. Data protection officer or EU representative, where required: [name and contact, or “not appointed”].",
  "privacy.2.intro":
    "2. What the Site processes. The Site is static: it sets no cookies, stores nothing in your browser for tracking, and loads no analytics, advertising, or third-party script.",
  "privacy.2.page":
    "Serving a page: IP address, user agent, time and requested URL in hosting logs; purpose: deliver pages and keep the service secure; basis: legitimate interest (GDPR Art. 6(1)(f)); retention: hosting provider's period, [period].",
  "privacy.2.submit":
    "Submitting a template: GitHub account/handle and issue-form text; purpose: review and publish the listing and credit the author; basis: pre-contractual steps requested by you (Art. 6(1)(b)) and moderation interest (Art. 6(1)(f)); retention: while listed plus [period] in repository history.",
  "privacy.2.email":
    "Email contact: your address and message; purpose: reply; basis: legitimate interest (Art. 6(1)(f)); retention: [period] after the exchange ends.",
  "privacy.2.hosting":
    "Hosting: GitHub Pages (GitHub, Inc., United States) receives request data for each visit. See GitHub's privacy statement. Transfers outside the EEA rely on [mechanism: standard contractual clauses / adequacy decision].",
  "privacy.2.automated":
    "No decision with legal effect is made about you by automated means, and no profiling is carried out.",
  "privacy.3":
    "3. What is published. A listing shows the display name and GitHub handle you provided, the public link or download archive of the template, and your description. Your email is never published. Your public GitHub handle links to your profile.",
  "privacy.4":
    "4. Recipients. [Hosting provider], GitHub (issues, repository), and [email provider, if any]. We do not sell data or share it for advertising.",
  "privacy.5":
    "5. Your rights. You may access, rectify, erase, restrict, object to, and port your data; withdraw consent where applicable without affecting prior processing. Write to [contact e-mail]. You may complain to a supervisory authority; in Romania, ANSPDCP (https://www.anspdcp.ro/), or in the country where you live or work.",
  "privacy.6":
    "6. Children. The Site is not for children. It follows the linked platform's age threshold (16) and requests no data identifying a child.",
  "privacy.7":
    "7. Changes. Changes are pull requests recorded in repository history. The last-change date appears in the commit updating this file.",
  "privacy.8":
    "8. Scope. Following links to openbot.run or GitHub subjects you to that service's privacy policy. OpenShelf does not control or take responsibility for their processing.",
  "terms.title": "Terms of use — DRAFT",
  "terms.description": "Terms of use for OpenShelf. Draft, not in force.",
  "terms.status":
    "Draft, not in force. Based on the legal review dated 2026-10-27; no legal entity is named. Complete every [placeholder] and obtain legal review before announcing the catalog. Not legal advice.",
  "terms.1":
    "1. Who we are. [Directory name] (“the Site”) is operated by [legal entity, form, registration number, address, e-mail] (“we”, “us”). Contact: [contact e-mail].",
  "terms.2":
    "2. What the Site is. A community directory of user-contributed OpenBot agent templates. Authors publish them on openbot.run or in a .zip archive; the Site stores descriptions, links and those archives. Templates come from their authors. The Site is not affiliated with, endorsed by, or sponsored by OpenBot, Synthetify Labs sp. z o.o., OpenAI, or template authors.",
  "terms.3":
    "3. Our code. Site source code is under the MIT License (LICENSE); third-party components keep their own licenses.",
  "terms.4":
    "4. Template license. Authors license templates under Creative Commons Attribution 4.0 International (templates/LICENSE), retain copyright, and are credited by name, link, license, and date. Reuse must credit the author, link the license, and state changes. We claim no ownership.",
  "terms.5":
    "5. Submissions. You retain your rights and grant us a worldwide, royalty-free, non-exclusive license to host, reproduce, display, and technically adapt the submission to operate the Site. You confirm you own or have written permission for the rights, it contains no credentials, secrets, third-party personal data, or unlawful content, and you accept these terms. Submission does not guarantee publication.",
  "terms.6":
    "6. Moderation. We may review, decline, edit, restrict, or remove submissions or suspend access for unlawful content, infringement, spam, security risk, broken link or archive, or breach. We state the main reason and appeal route when restricting or removing content. Reports go to [report e-mail] with description, exact URL, and good-faith statement. We assess diligently and impartially and reply within [response time]. Rights-holder reports are forwarded to the author for response.",
  "terms.7":
    "7. No warranty. Site and templates are provided “as is”. We do not review or run templates for safety, correctness, or fitness. You are responsible for what you install and the access granted to an agent.",
  "terms.8":
    "8. Liability. To the extent permitted by law, liability is limited to the legal minimum. Nothing excludes liability for intent, gross negligence, or liability that cannot lawfully be excluded.",
  "terms.9":
    "9. Changes. We may change these terms; the file date and pull request record the change. Continued use after a change means the new terms apply.",
  "terms.10":
    "10. Law. Governed by [jurisdiction]; courts of [jurisdiction] have jurisdiction, without prejudice to a consumer's right to use courts in their country of residence.",
  "hero.title": "OpenBot agents, one job each",
  "hero.lead":
    "A community shelf of {count} agent templates. Read what each agent does and refuses to do, then install it in OpenBot or download the .zip.",
  "hero.cta": "Browse the shelf",
  "shelf.title": "The shelf",
  "shelf.count": "{count} templates on the shelf",
  "shelf.countFiltered": "{shown} of {total} templates",
  "search.placeholder": "Search by name, job or tag",
  "listed.title": "How it gets listed",
  "listed.clause1": "First, the author publishes the agent in OpenBot.",
  "listed.clause2": "Then the form becomes a pull request.",
  "listed.clause3": "Checks run, then a person reviews it.",
  "listed.clause4": "Merged, it lands on the shelf.",
  "listed.state1": "Published in OpenBot",
  "listed.state2": "Submitted",
  "listed.state3": "Checks",
  "listed.state4": "On the shelf",
  "listed.category": "Category",
  "listed.tags": "Tags",
  "listed.check1": "Schema valid",
  "listed.check2": "Link responds with 200",
  "listed.check3": "No secrets found",
  "listed.check4": "Moderator review",
  "about.panel.title": "A shelf, not a store",
  "about.panel.it": "What it is",
  "about.panel.itBody":
    "A community directory that indexes and describes agent templates so people can find them. Installation happens in OpenBot, not here.",
  "about.panel.not": "What it is not",
  "about.panel.notBody":
    "Not affiliated with, endorsed or sponsored by OpenBot or Synthetify Labs. No accounts, no cookies of its own, no tracking.",
  "about.panel.cta": "Read about OpenShelf",
  "about.zip.title": "mail.zip",
  "about.zip.f1": "agent.json",
  "about.zip.f1d": "title, description, skills",
  "about.zip.f2": "README.md",
  "about.zip.f2d": "what it does, how to import",
  "about.zip.f3": "LICENSE",
  "about.zip.f3d": "CC BY 4.0",
  "about.zip.foot": "Import in OpenBot: Settings → Import",
  "faq.title": "Questions",
  "faq.q1": "What does Install do?",
  "faq.a1":
    "It opens the official listing on openbot.run, where OpenBot installs the agent. OpenShelf itself installs nothing.",
  "faq.q2": "How do I use a .zip?",
  "faq.a2":
    "Download it, then in OpenBot open Settings → Import and choose the file. The archive holds the agent's public profile only.",
  "faq.q3": "Is a template safe to run?",
  "faq.a3":
    "Read its instructions first. Templates are written by independent authors; OpenShelf checks the schema, the link and leaked secrets, not how an agent behaves.",
  "faq.q4": "Who can submit a template?",
  "faq.a4": "Anyone with a published OpenBot agent. One account may publish up to five agents.",
  "faq.q5": "How is a listing removed?",
  "faq.a5": "Through a pull request, at the author's request or after an abuse report.",
  "faq.q6": "Is OpenShelf part of OpenBot?",
  "faq.a6": "No. It is an independent community project, not affiliated with OpenBot or Synthetify Labs.",
  "legal.badge": "Draft",
  "detail.stageTitle": "Instructions",
  "detail.tagsTitle": "Tags",
  "detail.skillsTitle": "Skills",
  "detail.more": "More on the shelf",
  "detail.share": "Open official template",
} as const;
