# Claude Code — Execuneed

This repository is built by two sessions. Read the dual-dev brief before doing anything else:

- `docs/dev/CLAUDE_CODE_BRIEF.md` (source of truth for roles, webhook, tasks, lanes)
- `docs/product/EXECUNEED_AI_PLATFORM_PLAN.md` (product)

If `docs/plan/STATUS.md` exists, read it second.

## Session

You are either **lead** (Jared) or **support** (Deacon). If the human has not said which, ask once, then stop guessing.

## Always

1. Plan files before feature code on a fresh repo.
2. Claim tasks on the existing development workspace webhook before editing.
3. Lead owns schema, auth, APIs, AI, WhatsApp, compliance logic.
4. Support owns specified UI, pages, tables, tests, polish.
5. AI must not give financial advice.
6. Enquiry consent ≠ marketing consent.

## Do not

- Renumber task IDs
- Build a later phase because it is interesting
- Edit the other lane’s owned files without a `handoff` event
