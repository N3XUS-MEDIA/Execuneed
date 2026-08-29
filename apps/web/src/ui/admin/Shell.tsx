import Link from 'next/link'
import { copy } from '@/content/copy'
import { Wordmark } from '@/ui/layout/Wordmark'

const nav = [
  { href: '/admin/leads', label: copy.admin.leads },
  { href: '/admin/households', label: copy.admin.households },
  { href: '/admin/tasks', label: copy.admin.tasks },
]

export function AdminShell({
  user,
  signOut,
  children,
}: {
  user: { name?: string | null; role: string }
  signOut: () => Promise<void>
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper sm:flex-row">
      <aside className="bg-navy text-paper sm:w-56 sm:shrink-0">
        <div className="px-5 py-5">
          <Link href="/admin/leads" aria-label="Execuneed admin" className="block">
            <Wordmark width={150} />
          </Link>
          <p className="mt-2 text-sm text-paper/60">Practice admin</p>
        </div>
        <nav aria-label="Admin" className="px-2 pb-4">
          <ul className="flex gap-1 sm:flex-col">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex min-h-[44px] items-center rounded-md px-3 text-paper/75 transition-colors hover:bg-navy-light hover:text-paper"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
          <p className="truncate text-sm text-ink-muted">
            {user.name ?? 'Signed in'} · {user.role}
          </p>
          <form action={signOut}>
            <button type="submit" className="min-h-[44px] px-2 text-sm text-ink-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </header>
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
