# Development workspace webhook

Use the webhook both Claude accounts already know. Do not invent a second channel.

Resolve config in this order:

1. Existing Claude / MCP / connected tool
2. `.claude/workspace.json`
3. `DEV_WORKSPACE_WEBHOOK_URL`
4. `N3XUS_DEV_WEBHOOK_URL`

If none exist, post nothing and write the event to `docs/handoffs/` instead. Then tell the human.

## Events

`session.start` `session.end` `plan.updated` `task.claimed` `task.blocked` `task.ready_for_review` `task.done` `handoff` `contract.changed` `question` `decision`

## Payload

```json
{
  "project": "execuneed",
  "type": "task.claimed",
  "taskId": "P1-S-025",
  "from": "support",
  "to": "lead",
  "human": "Deacon",
  "branch": "feat/P1-S-025-lead-form",
  "files": ["apps/web/src/ui/leads/LeadForm.tsx"],
  "summary": "Wiring public lead form to createLeadAction",
  "blocker": null,
  "nextAction": "Playwright consent cases",
  "dependsOn": ["P1-L-007", "P1-L-008"],
  "timestamp": "2026-08-29T08:00:00+02:00"
}
```

## Required moments

- Before first file edit in a session: `session.start`
- Before touching ticket files: `task.claimed`
- Schema or exported type change: `contract.changed` from Lead
- Support finished: `task.ready_for_review`
- Leaving for the day: `session.end` with dirty files listed
