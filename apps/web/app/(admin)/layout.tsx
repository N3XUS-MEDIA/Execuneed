import { redirect } from 'next/navigation'
import { auth, signOut } from '@/server/auth'
import { isStaff } from '@/server/auth.config'
import { AdminShell } from '@/ui/admin/Shell'

/**
 * Middleware already gates /admin, but this is the second lock: a layout that
 * refuses to render for a non-staff session even if the matcher is ever
 * loosened. Compliance-critical routes get two checks, not one.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!isStaff(session?.user?.role)) redirect('/login')

  async function doSignOut() {
    'use server'
    await signOut({ redirectTo: '/login' })
  }

  return (
    <AdminShell
      user={{ name: session!.user.name, role: session!.user.role }}
      signOut={doSignOut}
    >
      {children}
    </AdminShell>
  )
}
