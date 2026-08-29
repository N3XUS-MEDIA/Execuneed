import { getOrganisationSettings } from '@/server/org'
import { SiteHeader } from '@/ui/layout/SiteHeader'
import { SiteFooter } from '@/ui/layout/SiteFooter'
import { StickyWhatsApp } from '@/ui/layout/StickyWhatsApp'
import { CookieNotice } from '@/ui/consent/CookieNotice'

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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sea focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="main" className="flex-1">
        {children}
      </div>
      <SiteFooter org={org} />
      <StickyWhatsApp e164={org?.whatsappE164} />
      <CookieNotice />
    </div>
  )
}
