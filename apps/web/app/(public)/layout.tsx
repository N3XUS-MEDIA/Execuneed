import { getOrganisationSettings } from '@/server/org'
import { SiteHeader } from '@/ui/layout/SiteHeader'
import { SiteFooter } from '@/ui/layout/SiteFooter'
import { MobileActionBar } from '@/ui/layout/MobileActionBar'
import { CookieNotice } from '@/ui/consent/CookieNotice'

/**
 * The footer disclaimer, phone number and WhatsApp link all come from
 * `OrganisationSettings`, which the practice has to be able to change without
 * a deploy. Without this the public pages prerender once at build time and the
 * legal wording freezes into the bundle.
 *
 * It also has a consequence worth knowing about. These pages stop being purely
 * static and become revalidating, so on a cold cache Next streams the shell
 * first and fills the page in behind it. There used to be a `loading.tsx` in
 * this segment; against a 5,000px page its ~460px skeleton produced a 0.56
 * cumulative layout shift as the footer dropped into place, measured on the
 * first request after a deploy. It was removed rather than resized — no honest
 * skeleton can reserve the height of these pages, and they are prerendered, so
 * there is nothing slow to cover.
 */
export const revalidate = 300

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const org = await getOrganisationSettings()

  return (
    <div className="flex min-h-dvh flex-col">
      {/*
        Keyboard users should not have to tab through the whole nav on every
        page to reach the form. Visible only when focused.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter org={org} />
      {/* The action bar is fixed to the bottom of the viewport. This reserves
          its height at the end of the document so the bar can always be
          scrolled clear of — it must never sit on a submit button. */}
      <div className="h-[var(--action-bar-h)] shrink-0 lg:hidden" aria-hidden="true" />
      <MobileActionBar e164={org?.whatsappE164} />
      <CookieNotice />
    </div>
  )
}
