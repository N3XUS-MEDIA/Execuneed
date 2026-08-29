# Compliance rules for engineers

This is not legal advice. It is build policy. Confirm final wording with Execuneed’s key individual and Discovery marketing support before indexing.

## FAIS / TCF

- The platform does not render financial advice.
- No model output may recommend a product, sum assured, premium, or plan name as “right for you.”
- Public UI copy educates and invites a review with a licensed representative.
- Staff AI (P3) may draft a Record of Advice. A licensed user must accept it.
- Keep records of advice and interactions. Retention target: 5 years.
- Advice given without a sale still needs a file. Schema in P3 must allow that.

## POPIA

- Collect the minimum for the purpose.
- Enquiry handling and direct marketing are different purposes.
- `contactForEnquiry` ≠ `marketing`.
- Electronic marketing needs opt-in or a documented existing-customer basis.
- Every future marketing send needs identity + working opt-out.
- No purchased lists.
- WhatsApp threads are records. They belong in Interaction storage, not personal phones.
- Data subject access / deletion workflow is P3+. Log the requirement in complaints/ops.

## Discovery marketing

- Do not put Discovery in domains or new email local-parts we create beyond what already exists.
- Generic Discovery logo same visual weight as Execuneed logo when used.
- Homepage disclaimer comes from `OrganisationSettings.discoveryJuristicText`.
- Product benefit copy requires `NEEDS_APPROVAL` until a Marketing Support ticket id is stored.

## FICA

- P1 must not collect ID documents on the public form.
- Vault arrives in P2 with staff-initiated requests only.

## Engineering enforcement

- Server rejects leads without enquiry consent.
- Public pages that are legally unfinished stay noindex.
- AuditEvent on lead create, consent change, login, document access (later).
- Client data never sent to a vendor that trains on prompts.

## Data residency

Supabase has no `af-south-1` region. The development database
(`execuneed-dev`) is in `eu-central-1` — Frankfurt. POPIA permits transfer to a
jurisdiction with comparable protection, and the EU qualifies, but this must be
stated in the privacy policy and confirmed with Execuneed's key individual
before go-live. Production hosting has not been chosen yet; if SA residency is
required, that decision has to be made before real client data is loaded.

**Row Level Security is currently disabled on all nine tables.** The app reaches
Postgres through Prisma with a direct connection, but the Supabase PostgREST API
is also live on the same tables and its anon key is designed to be public. Until
RLS is enabled, anyone holding that key can read every lead, person and consent
row. See `docs/plan/STATUS.md`.
