import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { Alert, Button, Card, Input } from '@execuneed/ui'
import { signIn, auth } from '@/server/auth'
import { isStaff } from '@/server/auth.config'

/**
 * P0-L-004 — staff sign in.
 *
 * A failed sign-in has to land back here with a message. Auth.js throws
 * AuthError from the server action, and letting that escape renders the Next
 * error page — which reads as "the site is broken" for what is simply a typo,
 * and leaks a stack trace in development.
 *
 * The message is deliberately the same for an unknown email, a wrong password
 * and a deactivated account, so this page cannot be used to enumerate staff.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const { callbackUrl, error } = await searchParams
  const session = await auth()
  if (isStaff(session?.user?.role)) redirect(callbackUrl ?? '/admin/leads')

  async function authenticate(formData: FormData) {
    'use server'
    const target = (formData.get('callbackUrl') as string) || '/admin/leads'
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: target,
      })
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/login?error=1${target ? `&callbackUrl=${encodeURIComponent(target)}` : ''}`)
      }
      // NEXT_REDIRECT and anything else genuinely unexpected must propagate.
      throw err
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <Card>
        <h1 className="font-heading text-2xl text-ink">Staff sign in</h1>
        <p className="mt-1 text-ink-muted">Execuneed practice admin.</p>

        {error ? (
          <div className="mt-4">
            <Alert tone="danger">
              Those details did not match an active staff account.
            </Alert>
          </div>
        ) : null}

        <form action={authenticate} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? ''} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required autoComplete="username" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" size="lg">
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  )
}
