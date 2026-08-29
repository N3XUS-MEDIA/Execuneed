import { EmptyState, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export default function AdminLeadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={copy.admin.leads} />
      <EmptyState title={copy.admin.emptyLeads} />
    </div>
  )
}
