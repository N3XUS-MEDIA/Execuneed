import { redirect } from 'next/navigation'
import { signIn, auth } from '@/server/auth'
import { isStaff } from '@/server/auth.config'

/**
 * P0-L-004 — minimal staff sign-in. Visual treatment is a Support ticket;
 * this exists so the /admin guard is testable end to end.
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
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: (formData.get('callbackUrl') as string) || '/admin/leads',
    })
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl">Staff sign in</h1>

      {error ? (
        <p role="alert" className="rounded-md bg-danger/10 p-3 text-sm text-danger">
          Those details did not match an active staff account.
        </p>
      ) : null}

      <form action={authenticate} className="flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? ''} />

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="rounded-md border border-line bg-white px-3 py-2 text-base"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-line bg-white px-3 py-2 text-base"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-sea px-4 py-3 text-base text-paper"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}
