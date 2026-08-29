import { EmptyState, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export default function AdminTasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={copy.admin.tasks} />
      <EmptyState title="Nothing outstanding." body="Tasks arrive with P1-L-015." />
    </div>
  )
}
