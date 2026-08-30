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
