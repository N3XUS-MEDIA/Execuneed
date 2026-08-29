import Link from 'next/link'
import { Badge, Button, Card, EmptyState, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { completeTaskAction, listTasksAction } from '@/server/tasks'

const sast = (d: Date) =>
  d.toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

export default async function AdminTasksPage() {
  const tasks = await listTasksAction()
  const open = tasks.filter((t) => t.status === 'open')
  const closed = tasks.filter((t) => t.status !== 'open')

  async function complete(formData: FormData) {
    'use server'
    await completeTaskAction(String(formData.get('id')))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={copy.admin.tasks} lede={`${open.length} open`} />

      {tasks.length === 0 ? (
        <EmptyState
          title="Nothing outstanding."
          body="Tasks are created against a lead or a household."
        />
      ) : (
        <Card className="flex flex-col gap-3 p-0">
          <ul>
            {[...open, ...closed].map((task) => {
              const overdue =
                task.status === 'open' && task.dueAt && task.dueAt.getTime() < Date.now()
              return (
                <li
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 last:border-0"
                >
                  <div className="min-w-0">
                    <p className={task.status === 'done' ? 'text-ink-muted line-through' : ''}>
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {task.lead ? (
                        <Link
                          href={`/admin/leads/${task.lead.id}`}
                          className="text-sea underline underline-offset-4"
                        >
                          {[task.lead.person.firstName, task.lead.person.lastName]
                            .filter(Boolean)
                            .join(' ')}
                        </Link>
                      ) : (
                        'No linked lead'
                      )}
                      {task.dueAt ? ` · due ${sast(task.dueAt)}` : ''}
                      {task.assignee?.name ? ` · ${task.assignee.name}` : ''}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {overdue ? <Badge tone="danger">Overdue</Badge> : null}
                    {task.status === 'open' ? (
                      <form action={complete}>
                        <input type="hidden" name="id" value={task.id} />
                        <Button type="submit" variant="secondary">
                          Mark done
                        </Button>
                      </form>
                    ) : (
                      <Badge tone="ok">Done</Badge>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
