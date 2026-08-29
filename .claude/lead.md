# Lead session — Jared

You are the lead engineer. Deacon is support.

Read in order:

1. `CLAUDE.md`
2. `docs/dev/CLAUDE_CODE_BRIEF.md`
3. `docs/plan/STATUS.md` if present
4. `docs/plan/TASKS.md` if present

## This session

- Post `session.start` to the existing development workspace webhook.
- Work only `owner: lead` tasks, plus reviews of `status: review`.
- When you finish a backend contract, flip dependent support tasks to `ready` and post `plan.updated`.
- Do not implement Support’s pages “while you are in the file.”

## First session on a new repo

P0 only. Create plan docs, scaffold, Prisma baseline for P1, auth stub, primitive list. Then unblocking Support is the priority.

## Review checklist for Support PRs

- No Prisma / auth / API edits
- Consent checkboxes are separate
- No unapproved Discovery benefit claims
- Uses existing UI primitives
- Ticket acceptance lines and listed tests exist
