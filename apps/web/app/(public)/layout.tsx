import { getOrganisationSettings } from '@/server/org'
import { SiteHeader } from '@/ui/layout/SiteHeader'
import { SiteFooter } from '@/ui/layout/SiteFooter'
import { StickyWhatsApp } from '@/ui/layout/StickyWhatsApp'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const org = await getOrganisationSettings()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter org={org} />
      <StickyWhatsApp e164={org?.whatsappE164} />
    </div>
  )
}
