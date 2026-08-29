import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Cookie policy',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Cookie policy'}
      summary={'What this website stores in your browser and why.'}
    />
  )
}
