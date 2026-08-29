import type { Config } from 'tailwindcss'
import { tokens } from './tokens'

const px = (n: number) => `${n}px`

/**
 * P0-L-005 — the single source of colour, type and radius for the whole build.
 * Everything visual consumes this preset. Do not introduce a second palette;
 * see docs/ui/PRIMITIVES.md.
 */
export const execuneedPreset = {
  content: [],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: tokens.color.navy,
          light: tokens.color.navyLight,
        },
        paper: tokens.color.paper,
        ink: {
          DEFAULT: tokens.color.ink,
          muted: tokens.color.inkMuted,
        },
        sand: tokens.color.sand,
        line: tokens.color.line,
        danger: tokens.color.danger,
        warn: tokens.color.warn,
        ok: tokens.color.ok,
        // `sea` was the pre-brand accent. Aliased to navy so nothing breaks
        // mid-migration; remove once no usage remains.
        sea: tokens.color.navy,
      },
      fontFamily: {
        heading: [tokens.font.heading],
        body: [tokens.font.body],
      },
      borderRadius: {
        sm: px(tokens.radius.sm),
        md: px(tokens.radius.md),
        lg: px(tokens.radius.lg),
      },
    },
  },
} satisfies Config

export default execuneedPreset
