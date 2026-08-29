import type { NextAuthConfig } from 'next-auth'
import type { Role } from '../contracts/types'

/**
 * P0-L-004 — edge-safe half of the auth setup.
 *
 * Middleware runs on the edge runtime, which cannot load Prisma or bcrypt.
 * Everything that touches the database lives in `auth.ts`; this file holds only
 * what the middleware needs to read a session cookie and decide access.
 */

export const STAFF_ROLES = ['superadmin', 'compliance', 'adviser', 'admin'] as const

export function isStaff(role: unknown): boolean {
  return (STAFF_ROLES as readonly string[]).includes(String(role))
}

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role
        token.uid = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid ?? '')
        session.user.role = token.role as Role
      }
      return session
    },
  },
} satisfies NextAuthConfig
