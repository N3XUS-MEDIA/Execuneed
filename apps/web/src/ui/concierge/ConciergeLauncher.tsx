'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { concierge } from '@/content/concierge'
import { ConciergePanel } from './ConciergePanel'

/**
 * The launcher is the Execuneed icon and nothing else.
 *
 * No circle, no pill, no card, no drop shadow, no little chat bubble glyph
 * sitting on top of it — the icon is the thing you press. It is the same file
 * the browser tab and the home screen use, so what someone taps here is what
 * they already recognise as Execuneed.
 *
 * Not shown on /cover-review or its confirmation. The form is right there, the
 * concierge would be offering the thing the visitor is already doing, and a
 * floating button in the bottom corner lands on the submit button at 375px.
 */
const HIDDEN_ON = ['/cover-review']

export function ConciergeLauncher({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const titleId = `${panelId}-title`
  const launcherRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  // Close on route change: a panel left open covers the page it moved to.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Move into the panel when it opens so a keyboard user is not left behind on
  // the launcher with the new content somewhere below them in the tab order.
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (hidden) return null

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-labelledby={titleId}
          id={panelId}
          className={[
            'fixed inset-x-3 bottom-[calc(var(--action-bar-h)+5rem)] top-20 z-40 flex flex-col',
            'overflow-hidden rounded-lg border border-line bg-paper shadow-xl focus:outline-none',
            'sm:inset-x-auto sm:right-4 sm:w-[24rem]',
            'lg:bottom-24 lg:right-6 lg:top-auto lg:h-[32rem] lg:w-[26rem]',
          ].join(' ')}
        >
          <div className="flex items-center gap-3 border-b border-line bg-navy px-4 py-3">
            <Image
              src="/brand/icon.png"
              alt=""
              width={512}
              height={512}
              className="size-9 shrink-0 rounded-sm"
            />
            <div className="min-w-0 flex-1">
              <p id={titleId} className="font-heading font-semibold tracking-tight text-paper">
                {concierge.title}
              </p>
              <p className="truncate text-xs text-paper/70">{concierge.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                launcherRef.current?.focus()
              }}
              className="-mr-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-paper"
            >
              <span className="sr-only">{concierge.launcherClose}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <ConciergePanel
            onClose={() => setOpen(false)}
            whatsappHref={whatsappHref}
            labelledBy={titleId}
          />
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={[
          'fixed right-4 z-40 rounded-lg transition-transform',
          'bottom-[calc(var(--action-bar-h)+0.75rem)] lg:bottom-6 lg:right-6',
          'hover:scale-105 motion-reduce:hover:scale-100',
        ].join(' ')}
      >
        <span className="sr-only">{open ? concierge.launcherClose : concierge.launcherLabel}</span>
        <Image
          src="/brand/icon.png"
          alt=""
          width={512}
          height={512}
          className="size-14 rounded-lg lg:size-16"
        />
      </button>
    </>
  )
}
