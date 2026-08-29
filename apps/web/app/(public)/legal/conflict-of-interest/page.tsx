import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Conflict of interest policy',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Conflict of interest policy'}
      summary={'How the practice identifies, avoids and discloses conflicts of interest.'}
    />
  )
}
