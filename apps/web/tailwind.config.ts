import type { Config } from 'tailwindcss'
import { execuneedPreset } from '@execuneed/ui/tailwind-preset'

export default {
  presets: [execuneedPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
} satisfies Config
