# Support log

Deacon / Support Claude appends here each session. Do not replace Lead plan files.

## Template

```markdown
### YYYY-MM-DD
- Claimed:
- Done:
- Review:
- Blocked:
- Notes:
```

## Entries

### 2026-08-30
- Claimed: design and content pass on the public pages (item 1 of
  `docs/handoffs/2026-08-29-lead-to-support-p2.md`).
- Done:
  - A layout system the pages share: `Container`, `Section` / `SectionHeading`,
    `PageHero`. Every public page had been repeating its own `max-w-*` and
    padding, and they had drifted apart by a few rem each.
  - Tonal rhythm instead of a stack of cards on one flat ground — paper, a navy
    band, sand. No new colours: the bands are the existing tokens.
  - `HexMark` / `HexRule`: the hexagon and bars from the icon, redrawn as inline
    SVG. It is the only ornament on the site. Photography is still a gap and
    stock imagery would be worse than none.
  - The nav collapses into a disclosure below `lg`. Four links across a 375px
    bar were wrapping onto a second row under the logo.
  - `StickyWhatsApp` becomes `MobileActionBar`. It rendered nothing at all while
    `whatsappE164` is blank, which left phones with no persistent call to
    action. It now always offers the review, with WhatsApp beside it once a
    number exists.
  - The lead form is grouped into three numbered steps. Same fields, same
    names, same order — a single unbroken column read as more work than it is.
  - Contrast audit against the navy palette. One real failure (`navy/40`
    numerals at 2.49:1) fixed; the full table is in `docs/ui/QA_CHECKLIST.md`.
  - Two new Playwright tests covering what this change introduced: the action
    bar never overlapping the submit button, and the nav disclosure.
- Review: `feat/P2-design-pass`. 113 unit and 66 Playwright tests green.
- Blocked: nothing.
- Notes: no photography, no second palette, no second button. Copy is unchanged
  — every sentence still comes from `content/copy.ts` or `content/products.ts`.


### 2026-08-30 (2)
- Claimed: P2-S-043, journal article templates.
- Done:
  - Eight cornerstone articles under `apps/web/src/content/journal/`, plus
    `/journal` and `/journal/[slug]`.
  - Seven of the eight are the topics in
    `docs/product/EXECUNEED_AI_PLATFORM_PLAN.md` §6.1. The eighth — changing
    jobs and the cover you had at work — is mine, chosen because it has real
    search intent and lands the reader on the retirement and protection
    articles.
  - The ninth §6.1 topic, Discovery integration, is published with its body
    empty behind `NeedsApproval` and an explanation of why. It is the one topic
    on the list that cannot be written without stating a Discovery benefit.
  - `journal.test.ts` carries the same gate as `products.test.ts`, plus a check
    that no article reads as a recommendation.
  - Articles that state a figure from legislation or scheme rules carry a
    `figuresNote`, rendered on the page, so the reader and the practice both
    know what has to be re-checked.
- Review: `feat/P2-S-043-journal`, stacked on `feat/P2-design-pass`.
  117 unit and 75 Playwright tests green.
- Blocked: nothing.
- Notes for Lead:
  - `app/sitemap.ts` lists five paths. It does not include `/services/[slug]`
    (already live) or the journal. That is your file — say the word and I will
    send a patch, or you can add them when indexing is switched on.
  - No JSON-LD on the articles. `script-src` in `src/server/securityHeaders.ts`
    is `'self'` with no `unsafe-inline`, so an inline `application/ld+json`
    block would be blocked by CSP. Article and FAQ schema is worth having for
    the GEO goal in §6.1, but it needs a CSP decision from you first.
  - A ninth article on short-term cover — "short-term cover renews itself,
    which is the problem" — is the obvious next one. The Short-term services
    category has no journal article. I did not write it into this PR because
    the ticket says eight.

_None yet._

### 2026-08-30 (3)
- Claimed: P2-S-044, digest email HTML.
- Done: `apps/web/src/ui/email/digest.ts` — `renderDigestHtml`, `digestSubject`
  and `escapeHtml`, with fifteen tests.
  - Template only, as the handoff says. Nothing in `src/server` was touched, so
    `runDailyDigest` still returns the plain-text body and nothing calls this
    yet. Lead wires it when there is a transport.
  - Tables and inline styles, because Outlook on Windows renders through Word
    and Gmail strips much of a `<style>` block. The one `<style>` block carries
    the responsive rules only, so losing it costs nothing that matters.
  - Colours come from `packages/ui` tokens, so the mail matches the site and
    there is still one palette. No web fonts — Montserrat is named first with a
    real fallback behind it.
  - Every interpolated value is escaped. This email carries names typed into a
    public form and is opened in staff mail clients; two of the tests exist
    only to prove that.
- Review: `feat/P2-S-044-digest-html`, branched from `main` — it does not depend
  on the design pass or the journal. 124 unit tests green.
- Blocked: nothing.
- Notes for Lead:
  - To wire it: `import { renderDigestHtml, digestSubject } from '@/ui/email/digest'`
    in `src/server/jobs/dailyDigest.ts` and return `{ subject, text: body, html }`
    from `runDailyDigest`. `renderDigest` stays as the text part of the
    multipart message rather than being replaced.
  - Leads link to `/admin/leads/{id}` when `NEXT_PUBLIC_APP_URL` is set, and
    render as plain names when it is not.
  - The digest cannot show consent state, which is the thing Denise would most
    want beside a name before she picks up the phone. `recentLeads` in
    `dailyDigest.ts` does not include `consents`. One line in your query and I
    will add the badge.

### 2026-08-30 (4)
- Claimed: the ninth journal article, on Deacon's instruction.
- Done: `car-and-home-cover-on-autopilot` — "Short-term cover renews itself,
  which is the problem".
  - It closes the last gap between the services categories and the journal.
    Every category now has an article behind it, and `journal.test.ts` asserts
    that rather than leaving it to be noticed later.
  - Same gate as the rest: no product named, no premium, no benefit claimed,
    and a `figuresNote` saying that average clauses and excess structures are
    policy wording rather than legislation and differ between insurers.
  - Related links rewired: buying a home and the business article both point at
    it, because those are the two moments a household's short-term exposure
    actually changes.
- Review: added to `feat/P2-S-043-journal` (PR #22).
- Blocked: nothing.

### 2026-08-30 (5)
- Claimed: the accessibility sweep on the lead form (item 3 of the P1 support
  brief, still open in the QA checklist).
- Done: walked the form as assistive technology does — tab order, accessible
  names, required/invalid state, resolved `aria-describedby`, and the same
  again after a failed submit. Three defects found and fixed:
  - the submit button was `disabled` and therefore not in the tab order at all,
    so the sentence explaining why it would not work was attached to an element
    nobody could reach. Now `aria-disabled`, with the gate enforced in the
    submit handler instead. `toBeDisabled()` still passes.
  - a field validation failure was announced nowhere and left focus on the
    submit button. Now announced in the live region, with focus moved to the
    first invalid control.
  - optional fields had accessible names like "Last nameOptional" — my own
    regression from the design pass.
- Review: on `feat/P2-design-pass` (PR #21), since two of the three are in code
  that PR touches. Four new Playwright tests, one per defect.
- Blocked: the VoiceOver-on-iOS-Safari item stays open. It needs a handset, and
  it should not be ticked off on the strength of the automated suite.

### 2026-08-30 (6)
- Claimed: the concierge launcher, on Deacon's instruction. This overlaps
  `P2-L-070`, which is Lead's and is `backlog`.
- Done: the Execuneed icon as the launcher, and the capture half of the
  concierge behind it.
  - The launcher is the icon and nothing else — no circle, no pill, no card, no
    shadow, no chat glyph on top of it. Same file as the browser tab and the
    home screen icon.
  - Not rendered on `/cover-review` or its confirmation. The form is already
    there, and a floating button in the bottom corner lands on the submit
    button at 375px.
  - **It answers nothing.** Fixed script, no model, no retrieval. `P2-L-070`
    scopes answering to content with a stored Discovery approval reference, and
    `DISCOVERY_APPROVALS.md` records that nothing has been submitted — so the
    corpus is empty and refusal is the ticket's own stated default. What a
    visitor types is carried into the enquiry as the message, never answered.
  - Consent is captured exactly as the web form captures it: two fields, two
    checkboxes, neither pre-ticked, the deck's wording, and the same
    `createLeadAction` doing the validating and the writing.
  - Carries the §Public AI disclaimer from `DISCLAIMERS.md` verbatim, as the
    ticket requires.
- Review: `feat/concierge-launcher`, stacked on the journal branch.
  118 unit and 87 Playwright tests green. Contrast and tap targets audited
  inside the panel at 375 and 1280 in both states: no findings.
- Notes for Lead:
  - `P2-L-070` stays open. This is its capture half; the RAG half is still
    blocked on `P2-L-039` and on an approved corpus.
  - There is no `chat` value in the `LeadSource` enum, so concierge enquiries
    are written as `web`. If you want them separable in the inbox, that is one
    enum value in your schema and one line here.
  - `AI_PUBLIC_ENABLED` is untouched and still false. Nothing here reads it,
    because nothing here calls a model.

### 2026-08-30 (7)
- Claimed: merging the four open support PRs, on Deacon's instruction.
- Done: #21, #22, #24, #23 squashed onto `main` in that order. Each branch was
  rebased onto the newly-squashed `main` before merging and its CI re-run on
  the rebased head, so nothing merged on the strength of a check against a
  different tree. #23's `SUPPORT_LOG.md` conflict was resolved by keeping both
  sets of entries in date order.
- Verified after: 133 unit and 87 Playwright tests green on `main`, CI green on
  the merge commit, production deployed at `66b6f57`, `X-Robots-Tag: noindex`
  still set.
- Closed: the Lighthouse-on-a-deployment item. Production measures 99 / 98 / 99
  performance, 100 accessibility, 100 best practices, CLS 0 — so the skeleton
  removal holds behind a CDN and was not a local artefact. Recorded in
  `docs/ui/QA_CHECKLIST.md`.
- Still open: the VoiceOver pass on iOS Safari. It needs a handset.
- Not mine: `ALLOW_INDEXING` stays unset until `CLIENT_ANSWERS.md` is filled in.
