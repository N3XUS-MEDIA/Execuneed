import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy policy',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Privacy policy'}
      summary={'How Execuneed collects, uses and stores your personal information under POPIA.'}
    />
  )
}
