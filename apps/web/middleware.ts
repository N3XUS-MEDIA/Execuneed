import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig, isStaff } from './src/server/auth.config'

/**
 * P0-L-004 — protect /admin.
 * Also enforces docs/plan/ARCHITECTURE.md §Indexing: nothing is crawlable
 * until ALLOW_INDEXING is deliberately set to true.
 */
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const role = req.auth?.user?.role
    if (!isStaff(role)) {
      const login = new URL('/login', req.url)
      login.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(login)
    }
  }

  const res = NextResponse.next()
  if (process.env.ALLOW_INDEXING !== 'true') {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico)$).*)'],
}
