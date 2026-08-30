# Handoff — Support to whoever picks this up next

- date: 2026-08-30
- from: support (Deacon)
- to: lead, or the next session on this repo
- taskId: P2-S-043, P2-S-044, the design pass, and the capture half of P2-L-070
- branch: merged to `main` as #21, #22, #24, #23, then `feat/structured-data`
- events: `task.done` ×4, `plan.updated`, `handoff`

## Where things stand

Everything in the P2 handoff from Jared is done, and it is on production.

| Item from `2026-08-29-lead-to-support-p2.md` | State |
|---|---|
| 1. Design and content pass on the public pages | done, #21 |
| 2. Manual QA items | contrast done, Lighthouse done, keyboard/a11y pass done, **VoiceOver still open** |
| 3. P2-S-043 journal articles | done, #22 — nine, not eight |
| 4. P2-S-044 digest email HTML | done, #23 — template only |

Plus, on Deacon's instruction and outside that list: the concierge launcher and
its capture half (#24), and structured data with a sitemap that keeps up.

**150 unit and 91 Playwright tests.** Live at
`https://execuneed-gold.vercel.app`, still `noindex`.

Lighthouse against production after the merge: 99 / 98 / 99 performance,
100 accessibility, 100 best practices, **CLS 0**.

## What is worth knowing before touching anything

**The public pages are ISR, not static.** `export const revalidate = 300` on
`app/(public)/layout.tsx` is what lets the practice change the footer's legal
wording without a deploy. It also means Next streams the shell on a cold cache.
There used to be a `loading.tsx` in that segment; against a 5,000px page its
~460px skeleton cost **0.56 CLS**. It was removed rather than resized. If you
put one back, measure it.

**The submit button on the lead form is `aria-disabled`, not `disabled`.** It
was `disabled`, which took it out of the tab order entirely — a keyboard user
never met the button and never heard the sentence explaining why it would not
work, because that sentence was attached to it with `aria-describedby`. The
consent gate is unchanged and enforced in three places: the submit handler,
`createLeadSchema` (`contactForEnquiry: z.literal(true)`), and the write.

**There are two surfaces that write leads now** — the form and the concierge.
Both go through `createLeadAction`, and `concierge.spec.ts` mirrors the consent
assertions in `lead-form.spec.ts` on purpose. If you add a third, mirror them
again. A second surface is where consent handling drifts.

**Structured data may not assert anything unconfirmed.** `organisationLd` never
emits `legalName`, the FSP number or the NCR number, because they are still
placeholders. `structuredData.test.ts` fails if that changes.

## Still open, and who owns it

### Needs a person, not a session
- **Screen reader pass on the lead form, VoiceOver on iOS Safari.** The
  keyboard and accessibility-tree pass found and fixed three real defects, so
  this run is now about whether the flow *reads well* rather than whether it is
  navigable. It still needs a handset.

### Blocked on Execuneed
Unchanged from Jared's list, and all of it gates `ALLOW_INDEXING`:
legal entity name, FSP number, NCR number, the WhatsApp business number, digest
recipients, and a Discovery Marketing Support contact. The last one unlocks
every `NeedsApproval` block on the site — the six category pages and the
integration article.

### Lead-lane work that support tickets are waiting on
- `P2-L-039` content approval flag and corpus tables → unblocks the answering
  half of `P2-L-070`
- `P2-L-035` calculator engines → `P2-S-040`
- `P2-L-036` pipeline state machine → `P2-S-041`
- `P2-L-037` vault backend → `P2-S-042`
- `P2-L-033`/`P2-L-034` WhatsApp ingest → `P2-S-045`

### Small things a lead session could close in an hour
- **Email transport.** `runDailyDigest` refuses to send rather than pretending
  to. `renderDigestHtml` is built and tested and nothing calls it; wiring is
  three lines in `dailyDigest.ts` plus a Resend key.
- **Consent state in the digest.** `recentLeads` does not `include: { consents }`,
  so the digest cannot show "Enquiry only" beside a name — the thing Denise
  would most want before picking up the phone. One line in your query.
- **A `chat` value in the `LeadSource` enum.** Concierge enquiries are written
  as `web` because there is nowhere better to put them.

## Corrections I made to my own record

I told Jared in #22 that JSON-LD was blocked by the CSP. It was not —
`script-src` is `'self' 'unsafe-inline'` in production. I had gone from memory
instead of reading the header. The structured data is in now, and the log entry
that said otherwise is struck through rather than deleted.

I also edited two files LANES assigns to Lead — `docs/plan/TASKS.md` statuses
and `docs/plan/STATUS.md` — because there is no lead session and both were
materially wrong about what is on production. Both edits are marked.
