# QA checklist — P1 public site and admin

Owner: Support. Re-run before any release that touches public pages.

Most of this is automated. `pnpm --filter @execuneed/web exec playwright test`
runs all of it; the manual items below are the ones a machine cannot judge.

## Automated (79 checks, `apps/web/tests/`)

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
| The blocked submit button is still reachable from the keyboard, and says why | pass |
| Pressing the blocked submit moves focus to the consent box | pass |
| A validation failure is announced, and focus moves to the field | pass |
| Optional fields do not run their label into the word "optional" | pass |
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
| No horizontal overflow — 11 pages × 375 / 768 / 1280px | pass (33) |
| Every control on `/cover-review` has a 44px hit area at 375px | pass |
| The sticky action bar never sits on the submit button | pass |
| The nav collapses into a 44px disclosure below `lg`, and it opens | pass |

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

## Lighthouse — run against a local production build

`pnpm build && pnpm --filter @execuneed/web exec next start -p 3300`, then
Lighthouse against that. Numbers from `next dev` are meaningless; this is a
real production bundle.

| Page | Performance | Accessibility | Best practices | CLS |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 0 |
| `/cover-review` | 99 | 100 | 100 | 0 |
| `/services` | 99 | 100 | 100 | 0 |
| `/contact` | 99 | 100 | 100 | 0 |

SEO scores 63 and that is correct: the only failing audit is "page is blocked
from indexing", which is exactly what `ALLOW_INDEXING=false` is for. Expect it
to jump once the legal wording is confirmed and indexing is switched on.

Three real issues came out of the first run and are fixed:

- A 404 on every page load — there was no favicon at all. `app/icon.svg` is a
  placeholder monogram built from the design tokens; the real one comes with
  the brand pack, which has not been received.
- Heading order skipped from `h1` to `h3`. `CardTitle` now takes an `as` prop
  and the pages where a card follows the page heading use `h2`.
- No Open Graph tags, so a link shared on WhatsApp or LinkedIn rendered as a
  bare URL. Added, without an image — a stock placeholder would be worse than
  none.

### Re-run after the P2 design pass

Same method, local production build, `next start` on :3300. Run against the
design pass and the journal together, and against `main` on the same machine
minutes apart so the comparison means something.

| Page | Performance | Accessibility | Best practices | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 96 | 100 | 100 | 2.7s | 0 |
| `/cover-review` | 97 | 100 | 100 | 2.7s | 0 |
| `/services` | 97 | 100 | 100 | 2.7s | 0 |
| `/contact` | 96 | 100 | 100 | 2.7s | 0 |
| `/journal` | 97 | 100 | 100 | 2.7s | 0 |

`main` measured 96 with CLS 0 on `/` in the same session, so the redesign is
level on performance and unchanged on accessibility.

**The run earned its keep.** The first pass came back at 72–73 with a
**0.563 CLS** on `/`, `/services`, `/cover-review` and `/journal`, and clean on
`/how-we-work`, `/legal/privacy` and `/cover-review/thanks`. The length
correlation was the clue.

`export const revalidate = 300` on the public layout — added so the practice can
change the footer's legal wording without a deploy — stops those pages being
purely static. On a cold cache Next streams the shell and uses `loading.tsx` as
the fallback, so the first paint was a ~460px skeleton with the footer directly
beneath it. The real pages are 4,000–5,000px, and the footer then dropped a full
viewport height. The Lighthouse filmstrip showed it directly: one frame of
skeleton-plus-footer, the next of the real page.

`app/(public)/loading.tsx` was removed rather than resized. No honest skeleton
can reserve the height of these pages, and they are prerendered, so there is
nothing slow for one to cover. The admin segment keeps its own `loading.tsx`,
where the pages really do wait on a query.

Worth repeating on the deployment once this is merged — a cold ISR cache behaves
differently behind a CDN than it does on a laptop.

### Confirmed on the live deployment

Re-run against `https://execuneed-gold.vercel.app` — real network, real CDN:

| Page | Performance | Accessibility | Best practices | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 2.1s | 0 |
| `/cover-review` | 100 | 100 | 100 | 1.7s | 0 |

No accessibility or best-practice failures. This item is closed.

## Colour contrast — audited against the navy palette

Measured, not eyeballed: every element on the public pages with a text node of
its own was walked at 375 / 768 / 1280, its computed colour composited over its
first opaque ancestor background, and the WCAG 2.1 ratio calculated. Large text
is `>= 24px`, or `>= 18.66px` at weight 700 or above.

One failure came out of it and is fixed: the step numerals on the home page,
`/how-we-work`, `/cover-review` and the lead form were `navy/40`, which is
**2.49:1** against paper. They are `navy/65` now.

| Foreground | Background | Ratio | AA normal | AA large |
|---|---|---|---|---|
| `ink` | `paper` | 15.91:1 | pass | pass |
| `ink` | `sand/50` | 15.00:1 | pass | pass |
| `ink` | `white` | 16.79:1 | pass | pass |
| `ink-muted` | `paper` | 5.78:1 | pass | pass |
| `ink-muted` | `sand/50` | 5.45:1 | pass | pass |
| `ink-muted` | `sand/40` | 5.52:1 | pass | pass |
| `ink-muted` | `white` | 6.10:1 | pass | pass |
| `navy` | `paper` | 16.20:1 | pass | pass |
| `navy/65` | `paper` | 5.26:1 | pass | pass |
| `navy/65` | `sand/50` | 5.14:1 | pass | pass |
| `navy/65` | `white` | 5.38:1 | pass | pass |
| `danger` | `white` | 7.53:1 | pass | pass |
| `danger` | `paper` | 7.13:1 | pass | pass |
| `ok` | `paper` | 6.01:1 | pass | pass |
| `warn` | `paper` | 5.60:1 | pass | pass |
| `paper` | `navy` | 16.20:1 | pass | pass |
| `paper/75` | `navy` | 9.51:1 | pass | pass |
| `paper/70` | `navy` | 8.43:1 | pass | pass |
| `paper/60` | `navy` | 6.52:1 | pass | pass |

`ink-muted` on `sand` — the combination the last pass flagged as the one to
check — is 5.45:1. It passes AA for normal text with room to spare.

Nothing on the public pages is below AA. Alpha values under `navy/65` and
`paper/60` are used for hairlines and decorative marks only, never for text.

## Manual — still to do

These need a person, and several need answers from the practice first.
- [ ] **Screen reader pass through the lead form (VoiceOver, iOS Safari).**
      Still open, and still needs a handset. See the keyboard and
      accessibility-tree pass below for what was done instead — not a
      substitute, but it found and fixed three real defects, so the VoiceOver
      run is now about whether the flow *reads well* rather than whether it is
      navigable at all.
- [ ] Check the footer disclaimer once the real wording exists. The slot is
      empty in production today, which is deliberate: `discoveryJuristicText`
      is blank and `Disclaimer` renders nothing rather than a placeholder.
- [ ] Sticky WhatsApp button — the bar is live and tested, but the WhatsApp
      half of it is not. `whatsappHref` returns null while `whatsappE164` is
      empty, so the bar currently shows "Book a review" plus the phone number.
      **When a number is added, check the WhatsApp path** and re-check the bar
      against the cookie notice: both are fixed to the bottom of the viewport.
      The notice is `z-50` and opaque so it covers the bar until it is
      answered, which is the intended order, but it is worth seeing once.
- [ ] Re-check the CSP once analytics or a chat widget is added. `connect-src`
      and `script-src` are locked to `'self'`; a third-party script will be
      blocked until its origin is added deliberately.

## Keyboard and accessibility-tree pass — lead form

Not a screen reader pass, and not a substitute for one. It walks the form the
way assistive technology does — every tab stop in order, with each control's
accessible name, its required and invalid state, and whatever its
`aria-describedby` actually resolves to — then does the same again after a
failed submission.

Three defects came out of it, all fixed and now covered by tests.

**The submit button was not in the tab order at all.** It carried `disabled`,
so a keyboard user went from the last consent checkbox straight to the phone
number in the sidebar. They never met the button, and never heard the sentence
explaining why it would not work — the sentence was attached to it with
`aria-describedby`, on an element that could not be focused.

It is `aria-disabled` now. Still announced as disabled, and
`expect(submit).toBeDisabled()` still passes, but reachable and it says why.
The consent gate is unchanged and enforced in three places: the submit handler,
`createLeadSchema` (`contactForEnquiry: z.literal(true)`), and again at the
point of the write. Pressing it while blocked moves focus to the consent box.

**A validation failure was silent.** Field errors render beside their input,
invisible to anyone not looking at the screen, and focus stayed on the submit
button — so pressing it appeared to do nothing. The live region now carries the
summary and focus moves to the first invalid control, which reads its own
message out of `aria-describedby`.

**Optional fields read as one word.** The accessible name of the last name
field was literally "Last nameOptional". Same for suburb and children at home.
They read "Last name — optional" now.

What a VoiceOver run on a handset would still add: whether the three numbered
steps help or interrupt, whether the consent wording is clear read aloud, and
how the sticky action bar behaves with the rotor. Those are judgements, not
assertions.

## Blocked on the practice

`ALLOW_INDEXING` must stay `false` until every item in
`docs/product/CLIENT_ANSWERS.md` is filled in. Legal entity, FSP number, NCR
number and the juristic representative wording are all still UNKNOWN.
