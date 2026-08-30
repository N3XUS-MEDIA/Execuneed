import Link from 'next/link'
import { whatsappHref } from '@/server/org'
import { copy } from '@/content/copy'

/**
 * The sticky bar on phones — docs/ui/WIREFRAMES.md, "WhatsApp + Book review".
 *
 * Replaces the floating WhatsApp bubble, which rendered nothing at all while
 * `OrganisationSettings.whatsappE164` is empty. That left the page with no
 * persistent call to action on the device most of this audience arrives on.
 * The bar always offers the review; WhatsApp appears beside it only once a
 * number is confirmed, and the phone number stands in until then.
 *
 * Two things it must not do:
 *
 *  - cover the submit button on the lead form. The public layout reserves
 *    `--action-bar-h` at the end of the document rather than letting this
 *    float over content (docs/ui/QA_CHECKLIST.md).
 *  - send anyone to an unverified number. `whatsappHref` returns null while
 *    the setting is blank.
 *
 * It sits below the cookie notice, which is `z-50` and opaque. The notice is a
 * one-time decision; once it is answered the bar is uncovered.
 */
export function MobileActionBar({ e164 }: { e164: string | null | undefined }) {
  const href = whatsappHref(e164, copy.whatsapp.prefill)
  const tel = copy.contact.phone.replace(/\s/g, '')

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch gap-2 px-4 py-3">
          <Link
            href="/cover-review"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-md bg-navy px-4 font-medium text-paper"
          >
            Book a review
          </Link>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-md border border-line bg-paper px-4 text-ink"
            >
              <WhatsAppGlyph className="size-5 text-ok" />
              <span className="sr-only">{copy.cta.whatsapp}</span>
            </a>
          ) : (
            <a
              href={`tel:${tel}`}
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-md border border-line bg-paper px-4 text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M4 5.5C4 4.7 4.7 4 5.5 4h2c.7 0 1.3.5 1.5 1.2l.6 2.4c.1.6-.1 1.2-.6 1.5l-1.2.8a12 12 0 0 0 5.3 5.3l.8-1.2c.3-.5.9-.7 1.5-.6l2.4.6c.7.2 1.2.8 1.2 1.5v2c0 .8-.7 1.5-1.5 1.5A14.5 14.5 0 0 1 4 5.5Z" />
              </svg>
              <span className="sr-only">{copy.cta.call}</span>
            </a>
          )}
        </div>
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 hidden min-h-[52px] items-center gap-2 rounded-lg bg-ok px-5 text-base text-paper shadow-lg lg:inline-flex"
        >
          <WhatsAppGlyph className="size-5" />
          {copy.cta.whatsapp}
        </a>
      ) : null}
    </>
  )
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 1.9 1.2 2.2 1.4.2.1.4.1.5-.1l.8-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
    </svg>
  )
}
