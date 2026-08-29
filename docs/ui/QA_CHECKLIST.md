# QA checklist — P1 public site and admin

Owner: Support. Re-run before any release that touches public pages.

Most of this is automated. `pnpm --filter @execuneed/web exec playwright test`
runs all of it; the manual items below are the ones a machine cannot judge.

## Automated (47 checks, `apps/web/tests/`)

### Consent — `lead-form.spec.ts`

| Check | Status |
|---|---|
| Enquiry consent only → `marketing` persists as false, no channels | pass |
| Marketing opt-in → channel persists exactly as ticked | pass |
| Submit stays disabled until enquiry consent is ticked | pass |
| A marketing opt-in alone cannot carry a submission through | pass |
| Marketing opt-in with no channel is rejected, nothing written | pass |
| Landline in the mobile field is rejected on the field | pass |
| **A validation error does not wipe what the visitor typed** | pass |
| Public pages send `X-Robots-Tag: noindex` | pass |
| Anonymous visitors are redirected away from `/admin` | pass |

### P1 live-done — `admin.spec.ts`

| Check | Status |
|---|---|
| Lead submitted on `/cover-review` appears in the admin inbox | pass |
| Denise signs in and sees score, SLA and consent state | pass |
| "Enquiry only" vs "Marketing opt-in" are visibly different | pass |
| Consent record renders verbatim on the lead file | pass |
| The web enquiry is already on the timeline | pass |
| A `client`-role account cannot reach `/admin` | pass |

### Responsive — `responsive.spec.ts`

| Check | Status |
|---|---|
| No horizontal overflow — 8 pages × 375 / 768 / 1280px | pass (24) |
| Every control on `/cover-review` has a 44px hit area at 375px | pass |

### Production readiness — `hardening.spec.ts`

| Check | Status |
|---|---|
| CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy present | pass |
| Server does not announce what it runs (`X-Powered-By` absent) | pass |
| `robots.txt` disallows everything while indexing is off | pass |
| Sitemap lists nothing while indexing is off | pass |
| Legal pages are `noindex` in their own right | pass |
| Cookie notice appears; declining is recorded and not re-asked | pass |
| An undecided visitor does not count as consent | pass |
| Honeypot is off-screen, unfocusable and outside the accessibility tree | pass |
| A submission filling the honeypot writes nothing | pass |
| Unknown page returns a real 404, not a stack trace | pass |
| Skip link is the first keyboard stop | pass |

## Manual — still to do

These need a person, and several need answers from the practice first.

- [ ] Lighthouse on the deployed preview. Not run locally: the numbers from
      `next dev` are meaningless, and there is no deploy target yet.
- [ ] Real content pass. The pages are correct but plain — photography, spacing
      and typographic rhythm are Deacon's next job.
- [ ] Screen reader pass through the lead form (VoiceOver, iOS Safari).
      Automated checks cover labels and `aria-describedby`; they do not tell
      you whether the flow makes sense out loud.
- [ ] Colour contrast audit against the tokens, including `ink-muted` on
      `sand`.
- [ ] Check the footer disclaimer once the real wording exists. It currently
      renders `NEEDS_LEGAL` placeholder text from the seed.
- [ ] Sticky WhatsApp button — cannot be tested until a WhatsApp number is
      confirmed. It hides itself while `whatsappE164` is empty, which is the
      correct behaviour but means the path is unexercised. **When a number is
      added, check it against the cookie notice**: both are fixed to the bottom
      of the viewport and will overlap until the notice is dismissed.
- [ ] Re-check the CSP once analytics or a chat widget is added. `connect-src`
      and `script-src` are locked to `'self'`; a third-party script will be
      blocked until its origin is added deliberately.

## Blocked on the practice

`ALLOW_INDEXING` must stay `false` until every item in
`docs/product/CLIENT_ANSWERS.md` is filled in. Legal entity, FSP number, NCR
number and the juristic representative wording are all still UNKNOWN.
