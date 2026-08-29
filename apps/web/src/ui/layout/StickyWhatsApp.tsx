import { whatsappHref } from '@/server/org'
import { copy } from '@/content/copy'

/**
 * P0-S-002 — sticky WhatsApp. Renders nothing without a confirmed number.
 */
export function StickyWhatsApp({ e164 }: { e164: string | null | undefined }) {
  const href = whatsappHref(e164, copy.whatsapp.prefill)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-ok px-5 text-base text-paper shadow-lg sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 1.9 1.2 2.2 1.4.2.1.4.1.5-.1l.8-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
      </svg>
      {copy.cta.whatsapp}
    </a>
  )
}
