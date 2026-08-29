import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'PAIA manual',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'PAIA manual'}
      summary={'How to request access to records held by the practice.'}
    />
  )
}
