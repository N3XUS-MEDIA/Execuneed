# Execuneed Platform — Claude Code Dual-Dev Brief

Read this file first. Do not start feature coding until Phase P0 planning artefacts exist in the repo.

This brief is for two Claude Code sessions working in the same development workspace:

| Human | Role | Claude session name | Workload |
|---|---|---|---|
| Jared Sinclair | Lead engineer | `lead` | Architecture, data, auth, integrations, AI, compliance-critical paths, reviews of Deacon’s work |
| Deacon | Support engineer | `support` | UI implementation from spec, pages, forms, tables, copy shells, tests, seeds, docs, polish |

N3XUS Media is building a website + admin platform for Execuneed Financial Services, a Cape Town Discovery-tied practice. Product context lives in `docs/product/EXECUNEED_AI_PLATFORM_PLAN.md`. This brief is the operating system for how the two of you build it together.

---

## 0. What you are being asked to do

Your first job is **plan and structure**, not “start inventing features.”

On the first run, the Lead session produces the workspace skeleton and the task graph. The Support session waits for that skeleton, then picks only tasks tagged `owner: support` and `status: ready`.

Both sessions stay in lockstep through the development workspace webhook you already use. If a session cannot find that webhook config, it stops and reports the gap. It does not invent a new channel.

---

## 1. Non-negotiables

1. AI never gives financial advice or product recommendations. Public AI educates and captures. Staff AI drafts. A licensed person signs.
2. Enquiry consent and marketing consent are separate fields. Never combine them.
3. Discovery product claims stay behind an approval flag. Do not ship unapproved benefit copy.
4. No “Discovery” in new domain names, emails, or social handles we create.
5. Do not buy scope. Build the current phase only.
6. Do not edit files owned by the other lane unless the webhook handoff says `takeover: allowed`.
7. If blocked for more than 15 minutes, post a blocker to the webhook and switch to an unblocked task in your lane.
8. Lead reviews Support PRs before merge to `main`.

---

## 2. Session identity

At the start of every session, announce yourself and persist identity in the workspace:

```text
role: lead | support
human: Jared | Deacon
branch: feat/<task-id>-<slug>
phase: P0 | P1 | P2 | P3 | P4
```

Lead Claude writes and updates:

- `docs/plan/STATUS.md`
- `docs/plan/TASKS.md`
- `docs/plan/ARCHITECTURE.md`
- `docs/plan/CONTRACTS.md`

Support Claude writes and updates:

- `docs/plan/SUPPORT_LOG.md`
- test files for assigned tickets
- UI implementation notes on the ticket, not new architecture docs

Neither session rewrites the other session’s planning files without a webhook proposal first.

---

## 3. Development workspace webhook protocol

Use the existing development workspace webhook both Claude accounts already know. Typical location patterns (check in this order, use what exists, do not create a fake one):

- repo skill / MCP / connected tool already configured
- `.claude/workspace.json`
- `.claude/webhook.md`
- env `DEV_WORKSPACE_WEBHOOK_URL`
- env `N3XUS_DEV_WEBHOOK_URL`

Every meaningful event is posted. Quiet coding with no events is a process failure.

### 3.1 Event types

| `type` | When |
|---|---|
| `session.start` | Session begins |
| `session.end` | Session pauses or finishes |
| `plan.updated` | Lead changes TASKS / ARCHITECTURE / CONTRACTS |
| `task.claimed` | You start a task |
| `task.blocked` | You cannot continue |
| `task.ready_for_review` | Implementation done, needs Lead review |
| `task.done` | Merged or accepted |
| `handoff` | Work moves from one human/session to the other |
| `contract.changed` | Shared type / API / schema changed |
| `question` | You need a decision |
| `decision` | Lead records an answer |

### 3.2 Payload shape

```json
{
  "project": "execuneed",
  "type": "task.claimed",
  "taskId": "P1-L-014",
  "from": "lead",
  "to": "support",
  "human": "Jared",
  "branch": "feat/P1-L-014-lead-scoring",
  "files": ["apps/web/src/lib/leads/score.ts"],
  "summary": "Implementing deterministic lead scoring from CONTRACTS.md",
  "blocker": null,
  "nextAction": "Write unit tests then hand UI badge work to P1-S-021",
  "dependsOn": ["P1-L-008"],
  "timestamp": "ISO-8601"
}
```

### 3.3 Rules

- Claim a task on the webhook **before** touching files.
- Never claim a task already `in_progress` unless the owner is you.
- Schema, API, or shared type changes require `contract.changed` from Lead **before** Support builds UI against them.
- Support never “just add a column” to Prisma. That is a Lead contract change.
- Lead never dump a half-written component in Support’s page folder mid-task. Open a handoff.
- At session end, post `session.end` with: tasks moved, files left dirty, exact next task for the other person.

### 3.4 Daily rhythm

1. Lead starts first, or reads `STATUS.md` if Support started on ready tickets.
2. Both post `session.start`.
3. Work in parallel on non-overlapping file trees.
4. Midday: Lead posts `plan.updated` if the board changed.
5. End of day: both post `session.end`. Lead updates `STATUS.md`.

---

## 4. First-run sequence (mandatory)

### Lead session — Run A (planning only)

Produce these files before any feature UI:

```text
docs/product/EXECUNEED_AI_PLATFORM_PLAN.md   # already exists; copy in if missing
docs/plan/README.md
docs/plan/STATUS.md
docs/plan/ARCHITECTURE.md
docs/plan/CONTRACTS.md
docs/plan/TASKS.md
docs/plan/LANES.md
docs/plan/DEFINITION_OF_DONE.md
docs/compliance/RULES.md
.claude/CLAUDE.md                            # short pointer to this brief
.claude/lead.md
.claude/support.md
```

Then scaffold the repo (still Lead):

```text
apps/web/                 # Next.js App Router — public site + portal + admin via route groups
packages/ui/              # shadcn primitives + Execuneed design tokens
packages/db/              # Prisma schema + generated client
packages/config/          # eslint, tsconfig, tailwind presets
docs/
```

Do not implement WhatsApp, AI agents, or the advice workbench in Run A.

### Support session — Run A

If the files above do not exist, stop. Post `question` to Lead.

If they exist:

1. Read `LANES.md`, `CONTRACTS.md`, `TASKS.md`.
2. Claim the first `owner: support` + `status: ready` ticket.
3. Implement only that ticket.
4. Post `task.ready_for_review`.

---

## 5. Target architecture (plan against this, do not freestyle)

```text
apps/web
  app/
    (public)/             # marketing site
    (auth)/               # login, magic link, otp
    (portal)/             # client portal
    (admin)/              # staff admin
    api/                  # route handlers
  src/
    server/               # lead-owned
    domain/               # lead-owned business rules
    ai/                   # lead-owned
    ui/                   # support-owned compositions
    content/              # support-owned page content modules

packages/db               # lead-owned
packages/ui               # shared; Support implements, Lead reviews tokens
```

Stack:

- Next.js App Router, TypeScript, Tailwind, shadcn/ui
- Postgres + Prisma
- Auth with roles: `superadmin` `compliance` `adviser` `admin` `client`
- Jobs: Inngest or Trigger.dev
- WhatsApp Cloud API
- Claude for drafting / extraction only
- pgvector later (P3), not P1
- E-sign later (P3)

---

## 6. Lane ownership (collision rules)

### Lead owns exclusively

- Prisma schema and migrations
- Auth / RBAC / session
- Domain state machines (lead, deal, ticket, advice file)
- Scoring, SLA, consent logic
- WhatsApp webhook + message store
- AI orchestration, prompts, RAG boundaries
- Audit log
- File storage encryption / signed URLs
- Jobs / queues
- Environment and secrets
- Discovery/FAIS/POPIA enforcement in code
- API contracts
- Production deploy pipeline

### Support owns exclusively once a ticket is ready

- Page layouts and visual implementation from wireframes
- Marketing page sections
- Admin table / filter / empty / loading states
- Form UI wired to existing server actions
- Email / WhatsApp copy templates **shells** (Lead owns send logic)
- Seed fixtures and factory helpers after schema exists
- Playwright / component tests for UI flows Lead has marked testable
- Accessibility, responsive polish, content placeholders
- `docs/ui/` notes and screenshot checklist

### Shared, but Lead merges

- `packages/ui` primitives
- `CONTRACTS.md`
- Anything under `app/api`

If Support needs a schema field, they open `question` with the proposed field. They do not edit `schema.prisma`.

---

## 7. Complexity split

Give Jared anything that can leak data, invent advice, break money, or fork the architecture.

Give Deacon anything that is specified, bounded, and visually verifiable.

| Complexity | Examples | Owner |
|---|---|---|
| C4 — foundation | schema, auth, audit, consent model | Lead |
| C3 — integration | WhatsApp, jobs, AI draft pipeline, e-sign | Lead |
| C2 — domain UI | FNA stepper wired to real actions, pipeline drag-drop against API | Lead builds actions, Support builds the screens if actions exist |
| C1 — specified UI | landing sections, legal pages, settings forms, tables | Support |
| C0 — chrome | buttons, empty states, loading skeletons, copy | Support |

Default: if a ticket mixes C3 and C1, split it. Lead does the C3 slice first and marks the C1 slice `ready`.

---

## 8. Phases

### P0 — Plan and structure (this brief’s first output)

Planning docs, repo skeleton, design tokens, CI lint, empty route groups, TASKS board.

### P1 — Foundation that can go live

Public site that converts + lead capture into an admin list Denise can use.

Must include:

- Home, How we work, Services overview, Cover review, Contact, legal pages
- Lead form with split consent
- Admin login
- Leads inbox + household stub + task stub
- Disclaimer from `OrganisationSettings`
- Audit row on lead create
- WhatsApp click-to-chat (human), not the bot yet

### P2 — Conversion and ops

Calculators, qualifier bot, pipeline, vault, review engine v1, daily digest, 8 articles.

### P3 — Advice and portal

FNA/RoA workbench, e-sign, client portal, meeting notes AI, staff RAG.

### P4 — Growth system

Campaign landers, ads plumbing, referrals, commission CSV, employer module.

Do not pull P2 work into P1 because it is interesting.

---

## 9. Planning artefacts Lead must write in P0

### `ARCHITECTURE.md`

System diagram, route groups, data stores, trust boundaries (public bot vs staff AI vs client file), env vars list, what is explicitly out of scope for P1.

### `CONTRACTS.md`

Canonical TypeScript types for:

- `OrganisationSettings`
- `Person` `Household` `Lead` `Task` `Interaction` `Consent` `AuditEvent`
- Lead statuses and score rules
- Server actions Support may call in P1
- Error shape

Support builds only against types written here.

### `TASKS.md`

Every task has:

```yaml
id: P1-L-014
phase: P1
owner: lead | support
complexity: C0-C4
status: backlog | ready | in_progress | blocked | review | done
title: Deterministic lead scoring
dependsOn: [P1-L-008]
files:
  - packages/db/prisma/schema.prisma
  - apps/web/src/domain/leads/score.ts
acceptance:
  - score is pure function with unit tests
  - no UI in this ticket
notes: Support consumes score badge in P1-S-021
```

### `LANES.md`

Directory ownership map and “who may touch what.”

### `STATUS.md`

Single source of truth updated at least once per session:

```markdown
# Status
Phase: P1
Lead focus: P1-L-014
Support focus: P1-S-009
Blocked: none
Last webhook event: ...
Next merge window: ...
```

---

## 10. Initial task graph

Lead creates these tickets in `TASKS.md` during P0. IDs are stable. Do not renumber.

### P0 — structure

| ID | Owner | Title |
|---|---|---|
| P0-L-001 | lead | Write ARCHITECTURE, CONTRACTS, LANES, STATUS |
| P0-L-002 | lead | Scaffold monorepo, tooling, env example, CI |
| P0-L-003 | lead | Prisma baseline for P1 entities only |
| P0-L-004 | lead | Auth + roles + admin guard |
| P0-L-005 | lead | Design tokens and `packages/ui` primitives list |
| P0-S-001 | support | Implement tokens + Button, Input, Select, Card, Badge, Dialog from list |
| P0-S-002 | support | Public layout: header, footer, disclaimer slot, sticky WhatsApp |
| P0-S-003 | support | Admin shell: sidebar, topbar, empty states |
| P0-S-004 | support | Copy deck file for all P1 pages using approved voice, placeholder legal text flagged `NEEDS_LEGAL` |

### P1 — Lead lane (complex)

| ID | Title |
|---|---|
| P1-L-006 | OrganisationSettings model + disclaimer renderer |
| P1-L-007 | Lead create server action + validation + audit |
| P1-L-008 | Consent model (enquiry vs marketing vs channel) |
| P1-L-009 | Household + Person create from lead |
| P1-L-010 | Admin session and role gates |
| P1-L-011 | File upload stub with signed URL policy (no public bucket) |
| P1-L-012 | Interaction timeline write API |
| P1-L-013 | SLA timestamps on lead create |
| P1-L-014 | Deterministic lead scoring |
| P1-L-015 | Task create / complete API |
| P1-L-016 | Daily digest job skeleton (email to Wayne + Denise, no AI yet) |
| P1-L-017 | Observability / error reporting |
| P1-L-018 | Seed script: org, users, sample leads |

### P1 — Support lane (bounded)

| ID | Title | Depends on |
|---|---|---|
| P1-S-019 | Home page sections from copy deck | P0-S-002, P0-S-004 |
| P1-S-020 | How we work page | P0-S-004 |
| P1-S-021 | Services overview page | P0-S-004 |
| P1-S-022 | Cover review landing page | P0-S-004 |
| P1-S-023 | Contact page | P0-S-004 |
| P1-S-024 | Legal page shells (Privacy, PAIA, Terms, Complaints, COI, Disclosures, Cookies) | P0-S-004 |
| P1-S-025 | Public lead form UI wired to P1-L-007 | P1-L-007, P1-L-008 |
| P1-S-026 | Success / what happens next screen | P1-S-025 |
| P1-S-027 | Admin leads table + filters + score badge | P1-L-014, P1-L-010 |
| P1-S-028 | Admin lead detail: fields, timeline list, task list | P1-L-012, P1-L-015 |
| P1-S-029 | Admin household stub page | P1-L-009 |
| P1-S-030 | Accessible form errors + loading states across public forms | P1-S-025 |
| P1-S-031 | Playwright: submit lead with / without marketing consent | P1-L-007 |
| P1-S-032 | Responsive pass + lighthouse checklist on public P1 pages | P1-S-019..024 |

Support may implement P1-S-019 to P1-S-024 in parallel the moment P0-S-002 and P0-S-004 are done. Those pages take dummy CTAs until P1-S-025.

---

## 11. Later-phase split (structure now, do not build now)

Lead writes these as `backlog` tickets so both sessions see the destination.

### P2 Lead

WhatsApp Cloud ingest, inbound classifier, qualifier state machine, calculator engines, pipeline state machine, document vault backend, review-due job, RAG corpus tables, content approval flag.

### P2 Support

Calculator UI, pipeline kanban UI, vault upload UI, article templates, campaign lander templates, digest email HTML, WhatsApp transcript panel.

### P3 Lead

Advice file versioning, RoA PDF generation, e-sign adapter, portal auth, meeting ingest, staff RAG isolation per household.

### P3 Support

FNA stepper UI, portal screens, document request list UI, signature status UI.

### P4 Lead

Ads conversion API, commission CSV import, referral attribution.

### P4 Support

Campaign pages, referral card UI, commission table UI.

---

## 12. How the two Claudes should think

### Lead Claude

You are staff engineer + tech lead.

- Optimise for a schema and contracts Support cannot accidentally violate.
- Prefer small server actions with Zod schemas exported from `CONTRACTS.md`.
- When you finish a backend ticket, immediately flip the dependent Support ticket from `backlog` to `ready` and post `plan.updated`.
- Review Support diffs for: consent bugs, leaked fields, unapproved Discovery claims, accessibility misses.
- If Support is idle, split a C2 ticket rather than letting them invent scope.

### Support Claude

You are product engineer implementing a locked spec.

- Do not invent new entities, endpoints, or scoring rules.
- If the contract is missing a field the UI needs, post `question`. Ship the UI disabled or with a labelled placeholder.
- Match existing primitives. Do not add a second button system.
- Keep Discovery benefit statements inside `NEEDS_APPROVAL` components.
- Write the Playwright test listed on the ticket before you mark `review`.
- Never “quickly fix” Prisma or auth to unblock yourself.

---

## 13. Branch and merge rules

```text
main
  feat/P0-L-002-scaffold
  feat/P0-S-001-ui-primitives
  feat/P1-L-007-lead-action
  feat/P1-S-025-lead-form
```

- One task per branch.
- Rebase on `main` before review.
- Lead merges Support branches.
- No direct commits to `main` except docs-only from Lead during P0.
- If two tickets must touch the same file, Lead owns the file and Support waits, or Lead extracts a component first.

High-collision files (Lead only unless ticket says otherwise):

```text
packages/db/prisma/schema.prisma
apps/web/src/server/**
apps/web/src/domain/**
apps/web/src/ai/**
apps/web/middleware.ts
apps/web/app/api/**
```

---

## 14. Definition of ready / done

A Support ticket is `ready` only when:

- Contract types exist
- Server action or fixture exists, or the ticket is static
- Copy deck keys exist
- Files to touch are listed
- Acceptance lines are written

A ticket is `done` only when:

- Acceptance lines pass
- Tests listed on the ticket pass
- Webhook `task.done` posted
- `TASKS.md` + `STATUS.md` updated
- No `NEEDS_LEGAL` copy accidentally presented as final on a route that can be crawled, unless the page is still `noindex` and behind a preview flag

P1 is live-done when Denise can log in, see a lead that came from the cover review form, and see whether marketing consent was given.

---

## 15. Starter prompts

### Lead — first message in a new repo

```text
You are the Lead Claude Code session for Execuneed (N3XUS). Human: Jared.
Read CLAUDE_CODE_BRIEF.md and docs/product/EXECUNEED_AI_PLATFORM_PLAN.md.
Your job this session is P0 only: plan and structure.
Create the docs/plan files, TASKS board with the IDs from the brief, repo skeleton, and Prisma baseline for P1.
Post session.start and plan.updated to the existing development workspace webhook.
Do not build WhatsApp bots, AI advice, or portal features.
When P0-L-001 to P0-L-005 are ready for Support, mark P0-S-001 to P0-S-004 ready and hand off.
```

### Support — first message

```text
You are the Support Claude Code session for Execuneed (N3XUS). Human: Deacon.
Read CLAUDE_CODE_BRIEF.md, docs/plan/LANES.md, docs/plan/TASKS.md, docs/plan/CONTRACTS.md, docs/plan/STATUS.md.
If those plan files do not exist, post question and stop.
Claim the highest-priority support task with status ready.
Do not edit Prisma, auth, or API routes.
Post session.start and task.claimed to the existing development workspace webhook.
Implement only that task. Then post task.ready_for_review.
```

### Lead — later session

```text
You are Lead / Jared. Read STATUS.md and TASKS.md.
Continue the next in_progress or ready lead task in phase P1.
Review any tickets in review owned by support.
Update contracts if you must, and post contract.changed before Support consumes them.
```

### Support — later session

```text
You are Support / Deacon. Read STATUS.md and TASKS.md.
Claim one ready support task. If none are ready, post question listing what you need unblocked.
Do not start backlog work that depends on unfinished lead tickets.
```

---

## 16. What good looks like after day 1

- Both Claudes have posted `session.start` / `session.end`
- `TASKS.md` exists with stable IDs and owners
- Repo builds
- Support has a layout and primitives to work against
- Lead has a P1 schema and auth stub
- Nobody is blocked on a conversation that only exists in someone’s head

## 17. What failure looks like

- Both sessions editing `schema.prisma`
- Support inventing a second leads table
- Lead redesigning the homepage mid-Support ticket
- A chatbot that recommends a Discovery plan
- Marketing consent bundled into “submit”
- No webhook events, then surprise conflicts at merge

---

## 18. Product reminder (keep this short in every session)

Execuneed turns family financial complexity into placed Discovery business and recurring reviews. Wayne advises. Denise runs the book. The site must book conversations. The admin must stop leads and reviews dying in WhatsApp. AI is leverage, not the adviser.
