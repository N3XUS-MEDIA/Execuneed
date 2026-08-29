import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Complaints process',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Complaints process'}
      summary={'How to raise a complaint with the practice and how it will be handled.'}
    />
  )
}
