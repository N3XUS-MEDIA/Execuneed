import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Disclosures',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Disclosures'}
      summary={'Statutory disclosures about the practice, its licences and how it is paid.'}
    />
  )
}
