# Definition of ready, done, and live

## Ready (Support may claim)

- Ticket has owner `support`, status `ready`
- `dependsOn` tickets are `done`
- Types exist in `CONTRACTS.md`
- Server action or static-only note exists
- Copy keys exist in `docs/ui/COPY_DECK.md`
- `files` list is written
- Acceptance lines are written

## Done (any ticket)

- Acceptance lines pass
- Listed tests pass
- No new unapproved Discovery benefit claims
- Webhook `task.done` posted
- `TASKS.md` updated
- Lead updated `STATUS.md` if it changes focus

## P0 done

- Plan files exist
- Monorepo installs
- `packages/ui` exports the primitive list
- Public and admin shells render empty states
- CI lint job exists

## P1 live-done

Denise can:

1. Open `/admin`
2. Sign in as `admin`
3. See a lead created from `/cover-review`
4. See enquiry consent = true
5. See marketing consent true or false as submitted
6. See score and SLA timestamp
7. See an audit row for `lead.created`

Public site:

- Footer disclaimer renders from `OrganisationSettings`
- Sticky WhatsApp uses `NEXT_PUBLIC_WHATSAPP_E164`
- Legal shells exist and are `noindex` until legal text is confirmed
- `ALLOW_INDEXING=false` in preview

## Never done

- A chatbot that recommends a product
- Marketing consent bundled into submit
- Unapproved Discovery premium or benefit numbers on a crawlable page
