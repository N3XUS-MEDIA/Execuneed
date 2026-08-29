/**
 * Execuneed design tokens.
 *
 * The palette is derived from the brand assets, not chosen: #0B1C33 is the
 * exact navy sampled from `Execuneed Icon.png` (85% of its pixels), and the
 * logo is white on that navy.
 *
 * The neutrals are deliberately cool. The first palette here was warm — cream
 * paper, tan sand, a warm near-black — which muddies against a cool navy. They
 * are now tinted toward the brand hue so the whole page reads as one system.
 */
export const tokens = {
  color: {
    /** Primary. The logo background, and the site's anchor colour. */
    navy: '#0B1C33',
    /** A lift of navy, for hovers and secondary surfaces on dark ground. */
    navyLight: '#16304F',

    /** Page background. Cool off-white so it sits under navy without muddying. */
    paper: '#F7F9FB',
    /** Body text. Navy-derived rather than a separate black. */
    ink: '#121E2E',
    inkMuted: '#54637A',

    /** Quiet surfaces: cards on paper, section bands. */
    sand: '#E7ECF2',
    line: '#D6DEE8',

    danger: '#9B2C2C',
    warn: '#8A5A12',
    ok: '#2F6B45',
  },
  font: {
    /**
     * The wordmark is a bold geometric sans. Montserrat is the closest
     * widely-available match and carries the same character into headings.
     */
    heading: 'var(--font-heading), Montserrat, "Helvetica Neue", Arial, sans-serif',
    /**
     * Inter for body. Montserrat is wide and tiring at paragraph length, and
     * this audience skews over 50 — legibility wins over brand consistency
     * below heading sizes.
     */
    body: 'var(--font-body), Inter, system-ui, sans-serif',
  },
  radius: { sm: 4, md: 8, lg: 16 },
} as const
