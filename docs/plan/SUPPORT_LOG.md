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

