import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

/**
 * P1-L-018 — development seed.
 *
 * Never run against production. Passwords come from the environment or are
 * generated and printed once; nothing usable is committed to git.
 *
 * Every legal value below is a PLACEHOLDER. The legal entity, FSP number, NCR
 * number and juristic representative wording are all still UNKNOWN in
 * docs/product/CLIENT_ANSWERS.md, and ALLOW_INDEXING must stay false until
 * they are confirmed with the practice's key individual.
 */

const prisma = new PrismaClient()

const NEEDS_LEGAL =
  'NEEDS_LEGAL — placeholder. Execuneed Financial Services is a juristic ' +
  'representative of [DISCOVERY ENTITY], registration number [REG NO], a ' +
  'registered long-term insurer and an authorised financial services and ' +
  'registered credit provider, NCR Reg No. [NCR NO]. Product rules, terms and ' +
  'conditions apply. Confirm exact wording with the key individual and ' +
  'Discovery Marketing Support before this page is indexed.'

function password(envKey: string): { plain: string; generated: boolean } {
  const fromEnv = process.env[envKey]
  if (fromEnv) return { plain: fromEnv, generated: false }
  return { plain: `dev-${randomUUID().slice(0, 12)}`, generated: true }
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database.')
  }

  const org = await prisma.organisationSettings.findFirst()
  if (!org) {
    await prisma.organisationSettings.create({
      data: {
        legalName: 'NEEDS_LEGAL — confirm registered entity name',
        tradingName: 'Execuneed Financial Services',
        disclaimer: NEEDS_LEGAL,
        discoveryJuristicText: NEEDS_LEGAL,
        phoneDisplay: '021 552 8989',
        // Blank on purpose. The number in the old .env.example looked like the
        // landline with a mobile prefix attached. The sticky WhatsApp button
        // hides itself rather than pointing somewhere unverified.
        whatsappE164: '',
        email: 'john@execuneed.co.za',
        addressLine1: 'Bridgeway',
        addressLine2: 'Century City',
        city: 'Cape Town',
        postalCode: '7441',
        fspNumber: null,
        ncrNumber: null,
      },
    })
  }

  const staff = [
    { email: 'wayne@execuneed.co.za', name: 'Wayne Martens', role: 'adviser' as const, env: 'SEED_WAYNE_PASSWORD' },
    { email: 'denise@execuneed.co.za', name: 'Denise', role: 'admin' as const, env: 'SEED_DENISE_PASSWORD' },
    { email: 'compliance@execuneed.co.za', name: 'Key Individual', role: 'compliance' as const, env: 'SEED_COMPLIANCE_PASSWORD' },
  ]

  const created: string[] = []
  for (const s of staff) {
    const { plain, generated } = password(s.env)
    const passwordHash = await bcrypt.hash(plain, 10)
    await prisma.user.upsert({
      where: { email: s.email },
      // The hash is rewritten on every run. Without it, re-seeding leaves the
      // old password in place and SEED_*_PASSWORD silently does nothing.
      update: { name: s.name, role: s.role, active: true, passwordHash },
      create: { email: s.email, name: s.name, role: s.role, passwordHash },
    })
    if (generated) created.push(`  ${s.email}  ${plain}`)
  }

  // A client-role user, so the /admin gate can be tested against a real
  // non-staff session rather than only against anonymous.
  const clientPw = password('SEED_CLIENT_PASSWORD')
  const clientHash = await bcrypt.hash(clientPw.plain, 10)
  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: { role: 'client', active: true, passwordHash: clientHash },
    create: {
      email: 'client@example.com',
      name: 'Test Client',
      role: 'client',
      passwordHash: clientHash,
    },
  })
  if (clientPw.generated) created.push(`  client@example.com  ${clientPw.plain}`)

  console.log('Seeded organisation settings and staff users.')
  if (created.length) {
    console.log('\nGenerated development passwords (shown once):')
    console.log(created.join('\n'))
    console.log('\nSet SEED_*_PASSWORD in .env to choose your own.\n')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
