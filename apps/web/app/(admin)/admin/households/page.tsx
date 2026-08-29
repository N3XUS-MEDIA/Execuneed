import { EmptyState, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export default function AdminHouseholdsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={copy.admin.households} />
      <EmptyState
        title="No households yet."
        body="A household is created the first time a lead comes in. P1-S-029 builds the detail view."
      />
    </div>
  )
}
