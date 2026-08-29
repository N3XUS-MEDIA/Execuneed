# Tasks

Stable IDs. Do not renumber. Lead updates status.

Status: `backlog | ready | in_progress | blocked | review | done`

---

## P0 — Structure

### P0-L-001
- owner: lead | complexity: C4 | status: done
- title: Confirm plan files are the working set
- files: docs/plan/**
- dependsOn: []
- acceptance:
  - STATUS, ARCHITECTURE, CONTRACTS, TASKS, LANES, DEFINITION_OF_DONE exist
  - webhook protocol documented

### P0-L-002
- owner: lead | complexity: C4 | status: done
- title: Scaffold monorepo, tooling, env example, CI
- files: package.json, pnpm-workspace.yaml, apps/web, packages/*, .github/workflows/ci.yml
- dependsOn: []
- acceptance:
  - pnpm install works
  - web app boots a placeholder page
  - lint workflow exists

### P0-L-003
- owner: lead | complexity: C4 | status: done
- title: Prisma baseline for P1 entities only
- files: packages/db/prisma/schema.prisma
- dependsOn: [P0-L-002]
- acceptance:
  - User, OrganisationSettings, Person, Household, Lead, Consent, Task, Interaction, AuditEvent
  - migrate on empty database

### P0-L-004
- owner: lead | complexity: C4 | status: done
- title: Auth + roles + admin guard
- files: apps/web/src/server/auth.ts, apps/web/middleware.ts, apps/web/app/(auth)/**
- dependsOn: [P0-L-003]
- acceptance:
  - staff can sign in
  - /admin rejects anonymous
  - client role cannot open /admin

### P0-L-005
- owner: lead | complexity: C2 | status: done
- title: Design tokens and primitive list
- files: packages/ui/src/tokens.ts, docs/ui/PRIMITIVES.md
- dependsOn: []
- acceptance:
  - tokens documented
  - primitive list matches P0-S-001

### P0-S-001
- owner: support | complexity: C1 | status: done
- title: Implement tokens + primitives
- files: packages/ui/**
- dependsOn: [P0-L-002, P0-L-005]
- acceptance:
  - Button, Input, Textarea, Select, Checkbox, Card, Badge, Dialog, Tabs export
  - no second colour system

### P0-S-002
- owner: support | complexity: C1 | status: done
- title: Public layout header footer disclaimer sticky WhatsApp
- files: apps/web/app/(public)/layout.tsx, apps/web/src/ui/layout/**
- dependsOn: [P0-S-001]
- acceptance:
  - disclaimer slot reads OrganisationSettings or placeholder
  - sticky WhatsApp link present on mobile

### P0-S-003
- owner: support | complexity: C1 | status: done
- title: Admin shell sidebar topbar empty states
- files: apps/web/app/(admin)/layout.tsx, apps/web/src/ui/admin/shell.tsx
- dependsOn: [P0-S-001, P0-L-004]
- acceptance:
  - nav: Leads, Households, Tasks
  - empty state component exists

### P0-S-004
- owner: support | complexity: C0 | status: done
- title: Confirm copy deck coverage for P1 pages
- files: docs/ui/COPY_DECK.md
- dependsOn: []
- acceptance:
  - every P1 public page has keys
  - legal pages marked NEEDS_LEGAL
  - Discovery benefit lines marked NEEDS_APPROVAL

---

## P1 — Lead lane

### P1-L-006
- owner: lead | complexity: C3 | status: done
- title: OrganisationSettings model + disclaimer renderer
- dependsOn: [P0-L-003]
- files: packages/db, apps/web/src/server/org.ts, apps/web/src/ui/layout/Disclaimer.tsx
- acceptance:
  - single org row seedable
  - footer renders discoveryJuristicText

### P1-L-007
- owner: lead | complexity: C4 | status: done
- title: createLeadAction + validation + audit
- dependsOn: [P0-L-003, P1-L-008, P1-L-013]
- files: apps/web/src/server/leads/createLeadAction.ts
- acceptance:
  - rejects missing enquiry consent
  - writes AuditEvent lead.created
  - returns leadId and score

### P1-L-008
- owner: lead | complexity: C4 | status: done
- title: Consent model enquiry vs marketing vs channels
- dependsOn: [P0-L-003]
- files: packages/db, apps/web/src/domain/consent.ts
- acceptance:
  - marketing false allowed
  - marketing true requires a channel
  - stored on person + lead

### P1-L-009
- owner: lead | complexity: C3 | status: done
- title: Household + Person create from lead
- dependsOn: [P1-L-007]
- files: apps/web/src/domain/households.ts
- acceptance:
  - new lead creates person
  - household stub labelled from lastName or firstName

### P1-L-010
- owner: lead | complexity: C3 | status: done
- title: Admin session and role gates on actions
- dependsOn: [P0-L-004]
- files: apps/web/src/server/auth.ts
- acceptance:
  - listLeadsAction unauthorized without staff role

### P1-L-011
- owner: lead | complexity: C3 | status: done
- title: Signed URL upload policy stub
- dependsOn: [P0-L-002]
- files: apps/web/src/server/files/policy.ts
- acceptance:
  - no public ACL
  - P1 does not expose an upload UI

### P1-L-012
- owner: lead | complexity: C3 | status: done
- title: Interaction timeline write API
- dependsOn: [P1-L-007]
- files: apps/web/src/server/interactions.ts
- acceptance:
  - lead create writes system interaction
  - getLeadAction returns chronological list

### P1-L-013
- owner: lead | complexity: C3 | status: done
- title: SLA timestamps on lead create
- dependsOn: [P1-L-014]
- files: apps/web/src/domain/leads/sla.ts
- acceptance:
  - score >= 7 uses 15 minute office-hours rule
  - unit tests for weekend overflow

### P1-L-014
- owner: lead | complexity: C3 | status: done
- title: Deterministic lead scoring
- dependsOn: [P0-L-002]
- files: apps/web/src/domain/leads/score.ts
- acceptance:
  - pure function unit tests for weights in CONTRACTS.md

### P1-L-015
- owner: lead | complexity: C2 | status: done
- title: Task create / complete API
- dependsOn: [P0-L-003, P1-L-010]
- files: apps/web/src/server/tasks.ts
- acceptance:
  - completeTaskAction is idempotent

### P1-L-016
- owner: lead | complexity: C3 | status: done
- title: Daily digest job skeleton
- dependsOn: [P1-L-007]
- files: apps/web/src/server/jobs/dailyDigest.ts
- acceptance:
  - dry-run lists yesterday’s leads
  - no AI

### P1-L-017
- owner: lead | complexity: C2 | status: done
- title: Error reporting hook
- dependsOn: [P0-L-002]
- files: apps/web/src/server/log.ts
- acceptance:
  - server actions log ActionError codes

### P1-L-018
- owner: lead | complexity: C2 | status: done
- title: Seed org, users, sample leads
- dependsOn: [P1-L-007, P1-L-006]
- files: packages/db/src/seed.ts
- acceptance:
  - wayne@ and denise@ staff users
  - 5 sample leads with mixed marketing consent

---

## P1 — Support lane

### P1-S-019
- owner: support | complexity: C1 | status: done
- title: Home page sections
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/page.tsx, apps/web/src/content/home.ts
- acceptance:
  - uses copy deck keys
  - primary CTA is cover review

### P1-S-020
- owner: support | complexity: C1 | status: done
- title: How we work page
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/how-we-work/page.tsx

### P1-S-021
- owner: support | complexity: C1 | status: done
- title: Services overview page
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/services/page.tsx
- acceptance:
  - no unapproved Discovery premiums

### P1-S-022
- owner: support | complexity: C1 | status: done
- title: Cover review landing page
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/cover-review/page.tsx

### P1-S-023
- owner: support | complexity: C1 | status: done
- title: Contact page
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/contact/page.tsx

### P1-S-024
- owner: support | complexity: C1 | status: done
- title: Legal page shells
- dependsOn: [P0-S-002, P0-S-004]
- files: apps/web/app/(public)/legal/**
- acceptance:
  - robots noindex until ALLOW_INDEXING
  - NEEDS_LEGAL visible only in preview banner for staff, not as fake final law

### P1-S-025
- owner: support | complexity: C1 | status: done
- title: Public lead form UI wired to createLeadAction
- dependsOn: [P1-L-007, P1-L-008]
- files: apps/web/src/ui/leads/LeadForm.tsx
- acceptance:
  - two consent checkboxes
  - cannot submit without enquiry consent

### P1-S-026
- owner: support | complexity: C0 | status: done
- title: Success / what happens next screen
- dependsOn: [P1-S-025]
- files: apps/web/app/(public)/cover-review/thanks/page.tsx

### P1-S-027
- owner: support | complexity: C1 | status: done
- title: Admin leads table filters score badge
- dependsOn: [P1-L-014, P1-L-010, P0-S-003]
- files: apps/web/app/(admin)/leads/page.tsx

### P1-S-028
- owner: support | complexity: C1 | status: done
- title: Admin lead detail timeline and tasks
- dependsOn: [P1-L-012, P1-L-015, P0-S-003]
- files: apps/web/app/(admin)/leads/[id]/page.tsx

### P1-S-029
- owner: support | complexity: C1 | status: done
- title: Admin household stub page
- dependsOn: [P1-L-009, P0-S-003]
- files: apps/web/app/(admin)/households/[id]/page.tsx

### P1-S-030
- owner: support | complexity: C1 | status: done
- title: Accessible form errors and loading states
- dependsOn: [P1-S-025]
- files: apps/web/src/ui/leads/LeadForm.tsx
- acceptance:
  - errors linked with aria-describedby

### P1-S-031
- owner: support | complexity: C1 | status: done
- title: Playwright submit lead with and without marketing consent
- dependsOn: [P1-L-007, P1-S-025]
- files: apps/web/tests/lead-form.spec.ts
- acceptance:
  - both paths create a lead
  - marketing false persists

### P1-S-032
- owner: support | complexity: C0 | status: done
- title: Responsive pass and lighthouse checklist
- dependsOn: [P1-S-019, P1-S-020, P1-S-021, P1-S-022, P1-S-023, P1-S-024]
- files: docs/ui/QA_CHECKLIST.md

---

## P1 — Production readiness

Added after the P1 feature work landed. These are the gap between "the tests
pass" and "this is safe to put in front of the public". IDs continue from
P4-S-058; nothing is renumbered.

### P1-L-059
- owner: lead | complexity: C3 | status: done
- title: Rate limit and honeypot on public lead capture
- dependsOn: [P1-L-007]
- files: apps/web/src/server/rateLimit.ts, apps/web/src/server/clientIp.ts
- acceptance:
  - unauthenticated writes are limited per caller
  - a filled honeypot writes nothing and still reports success
  - IP addresses are never persisted

### P1-L-060
- owner: lead | complexity: C3 | status: done
- title: Security headers and CSP
- dependsOn: [P0-L-002]
- files: apps/web/src/server/securityHeaders.ts, apps/web/next.config.ts
- acceptance:
  - no unsafe-eval in production
  - frame-ancestors none, form-action self
  - HSTS in production only

### P1-S-061
- owner: support | complexity: C1 | status: done
- title: Cookie notice and consent gate
- dependsOn: [P0-S-002]
- files: apps/web/src/domain/cookieConsent.ts, apps/web/src/ui/consent/CookieNotice.tsx
- acceptance:
  - absence of a decision is not consent
  - decline is offered as plainly as accept
  - a gate exists for analytics to pass through later

### P1-S-062
- owner: support | complexity: C0 | status: done
- title: Error, not-found and loading states
- dependsOn: [P0-S-002]
- files: apps/web/app/error.tsx, apps/web/app/not-found.tsx
- acceptance:
  - no stack trace or digest shown to a visitor
  - the error page offers the phone number

### P1-L-063
- owner: lead | complexity: C2 | status: done
- title: robots.txt and sitemap gated on ALLOW_INDEXING
- dependsOn: [P0-L-002]
- files: apps/web/app/robots.ts, apps/web/app/sitemap.ts
- acceptance:
  - disallow everything until indexing is deliberately enabled
  - legal pages never listed

### P1-S-064
- owner: support | complexity: C1 | status: done
- title: Admin tasks page wired to completeTaskAction
- dependsOn: [P1-L-015]
- files: apps/web/app/(admin)/admin/tasks/page.tsx
- acceptance:
  - open work first, overdue flagged
  - completing revalidates the list

### P1-L-065
- owner: lead | complexity: C2 | status: done
- title: Deployment runbook and go-live gate
- dependsOn: []
- files: docs/ops/DEPLOYMENT.md
- acceptance:
  - go-live gate lists the unanswered client questions
  - known production limits are written down, not implied

---

## P2 backlog — do not start in P1

### P2-L-033
- owner: lead | status: backlog
- title: WhatsApp Cloud ingest + message store

### P2-L-034
- owner: lead | status: backlog
- title: Inbound classifier + qualifier state machine

### P2-L-035
- owner: lead | status: backlog
- title: Calculator engines (education only)

### P2-L-036
- owner: lead | status: backlog
- title: Pipeline deal state machine

### P2-L-037
- owner: lead | status: backlog
- title: Document vault backend

### P2-L-038
- owner: lead | status: backlog
- title: Review-due job

### P2-L-039
- owner: lead | status: backlog
- title: Content approval flag + corpus tables

### P2-S-040
- owner: support | status: backlog
- title: Calculator UI

### P2-S-041
- owner: support | status: backlog
- title: Pipeline kanban UI

### P2-S-042
- owner: support | status: backlog
- title: Vault upload UI

### P2-S-043
- owner: support | status: backlog
- title: Journal article templates (8 cornerstone)

### P2-S-044
- owner: support | status: backlog
- title: Digest email HTML

### P2-S-045
- owner: support | status: backlog
- title: WhatsApp transcript panel

---

## P3 backlog

### P3-L-046
- owner: lead | status: backlog
- title: Advice file versioning + RoA PDF

### P3-L-047
- owner: lead | status: backlog
- title: E-sign adapter

### P3-L-048
- owner: lead | status: backlog
- title: Portal auth OTP

### P3-L-049
- owner: lead | status: backlog
- title: Meeting ingest + staff RAG isolation

### P3-S-050
- owner: support | status: backlog
- title: FNA stepper UI

### P3-S-051
- owner: support | status: backlog
- title: Portal screens

### P3-S-052
- owner: support | status: backlog
- title: Signature status UI

---

## P4 backlog

### P4-L-053
- owner: lead | status: backlog
- title: Ads conversion API

### P4-L-054
- owner: lead | status: backlog
- title: Commission CSV import

### P4-L-055
- owner: lead | status: backlog
- title: Referral attribution

### P4-S-056
- owner: support | status: backlog
- title: Campaign landers

### P4-S-057
- owner: support | status: backlog
- title: Referral card UI

### P4-S-058
- owner: support | status: backlog
- title: Commission table UI
