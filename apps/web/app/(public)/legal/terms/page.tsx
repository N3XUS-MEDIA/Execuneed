import type { Metadata } from 'next'
import { LegalShell, legalMetadata } from '@/ui/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of use',
  ...legalMetadata,
}

export default function Page() {
  return (
    <LegalShell
      title={'Terms of use'}
      summary={'The terms that apply when you use this website.'}
    />
  )
}
