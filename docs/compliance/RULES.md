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
