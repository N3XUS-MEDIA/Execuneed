import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@execuneed/db'
import { authConfig, isStaff } from './auth.config'
import type { Role } from '../contracts/types'

/**
 * P0-L-004 — staff sign-in.
 *
 * Credentials against the existing `User` table, JWT sessions. Deliberately no
 * Auth.js database adapter: the adapter's Account/Session/VerificationToken
 * tables are not in the P1 schema (docs/plan/ARCHITECTURE.md lists the nine
 * entities that are). Magic link / OTP for the client portal is P3-L-048, and
 * that is when adapter tables become a real contract change.
 */

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        })
        if (!user || !user.active || !user.passwordHash) return null

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!ok) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
})

/**
 * Guard for server actions. Admin actions require a staff role
 * (docs/plan/CONTRACTS.md — "Admin actions require admin | adviser |
 * compliance | superadmin").
 */
export async function requireStaff(): Promise<{ id: string; role: Role }> {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user?.id || !isStaff(role)) {
    throw Object.assign(new Error('Staff role required'), { code: 'UNAUTHORIZED' })
  }
  return { id: session.user.id, role: role as Role }
}
