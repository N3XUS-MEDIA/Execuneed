# UI primitives list

Lead defines. Support implements in `packages/ui`.

## Tokens

- Colour: paper, ink, ink-muted, sand, sea, line, danger, warn, ok
- Font: serif heading, sans body
- Radius: 4 / 8 / 16
- Shadow: none on marketing, faint on admin cards
- Space: 4pt grid

Direction: quiet luxury, light, Cape Town. Not fintech neon.

## Components P0

- Button (primary, secondary, ghost, link)
- Input
- Textarea
- Select
- Checkbox
- RadioGroup
- Card
- Badge (score, consent, status)
- Dialog
- Tabs
- Alert
- EmptyState
- PageHeader
- Disclaimer
- NeedsApproval (wrapper that renders children only if approved flag true; otherwise omit or show generic sentence)

## Do not add in P0

Charts, rich text editor, kanban library, toast framework beyond a single Alert.
