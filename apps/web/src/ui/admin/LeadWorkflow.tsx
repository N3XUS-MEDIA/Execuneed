import { Button, Card, CardTitle, Select, Textarea } from '@execuneed/ui'
import { assignLeadAction, updateLeadStatusAction } from '@/server/leads/mutations'
import { LEAD_STATUSES, leadStatusLabel } from '@/domain/leads/status'
import { addInteractionAction } from '@/server/interactions'
import { createTaskAction } from '@/server/tasks'

/**
 * P1-S-067 — the controls that let Denise actually work a lead.
 *
 * Server actions on plain forms rather than a client component: every one of
 * these is a single round trip with no interim state worth holding, and it
 * keeps the whole panel working without JavaScript.
 */
export function LeadWorkflow({
  leadId,
  status,
  assigneeId,
  staff,
}: {
  leadId: string
  status: string
  assigneeId: string | null
  staff: { id: string; name: string; role: string }[]
}) {
  async function setStatus(formData: FormData) {
    'use server'
    await updateLeadStatusAction({
      leadId,
      status: String(formData.get('status')),
      reason: String(formData.get('reason') ?? ''),
    })
  }

  async function assign(formData: FormData) {
    'use server'
    const value = String(formData.get('assigneeId'))
    await assignLeadAction({ leadId, assigneeId: value === '' ? null : value })
  }

  async function addNote(formData: FormData) {
    'use server'
    await addInteractionAction({
      leadId,
      channel: String(formData.get('channel')),
      direction: 'outbound',
      body: String(formData.get('body') ?? ''),
    })
  }

  async function addTask(formData: FormData) {
    'use server'
    await createTaskAction({ leadId, title: String(formData.get('title') ?? '') })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardTitle>Move this lead</CardTitle>
        <form action={setStatus} className="mt-4 flex flex-col gap-3">
          <label htmlFor="status" className="text-sm text-ink-muted">
            Status
          </label>
          <Select id="status" name="status" defaultValue={status}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {leadStatusLabel(s)}
              </option>
            ))}
          </Select>

          <label htmlFor="reason" className="text-sm text-ink-muted">
            Reason — required when marking lost
          </label>
          <Textarea
            id="reason"
            name="reason"
            rows={2}
            placeholder="Price, inertia, went direct, not ready, competitor"
          />

          <Button type="submit" variant="secondary">
            Update status
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Owner</CardTitle>
        <form action={assign} className="mt-4 flex flex-col gap-3">
          <label htmlFor="assigneeId" className="text-sm text-ink-muted">
            Assigned to
          </label>
          <Select id="assigneeId" name="assigneeId" defaultValue={assigneeId ?? ''}>
            <option value="">Nobody</option>
            {staff.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="secondary">
            Assign
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Log a conversation</CardTitle>
        {/* "If it's not in the system it didn't happen." A call Denise makes
            from her desk has to land on the file the same as a web enquiry. */}
        <form action={addNote} className="mt-4 flex flex-col gap-3">
          <label htmlFor="channel" className="text-sm text-ink-muted">
            Channel
          </label>
          <Select id="channel" name="channel" defaultValue="phone">
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
          </Select>

          <label htmlFor="body" className="text-sm text-ink-muted">
            What was said
          </label>
          <Textarea id="body" name="body" rows={3} required />

          <Button type="submit" variant="secondary">
            Add to timeline
          </Button>
        </form>
      </Card>

      <Card>
        <CardTitle>Add a task</CardTitle>
        <form action={addTask} className="mt-4 flex flex-col gap-3">
          <label htmlFor="title" className="text-sm text-ink-muted">
            What needs doing
          </label>
          <Textarea id="title" name="title" rows={2} required />
          <Button type="submit" variant="secondary">
            Create task
          </Button>
        </form>
      </Card>
    </div>
  )
}
