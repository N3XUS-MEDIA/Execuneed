# Execuneed — AI Website + Admin Platform
## Master product brief for Claude Code

**Client:** Execuneed Financial Services  
**Builder:** N3XUS Media  
**Market:** Cape Town / Western Cape families and professionals  
**Product supplier:** Discovery Group (Life, Health, Invest, Insure, Bank, Vitality, Gap, Group Risk)  
**Legal posture:** Almost certainly a juristic representative / Discovery-tied practice. Confirm FSP / juristic representative status before any copy goes live.  
**Non-negotiable:** The system must look premium, reduce admin load, generate qualified daily leads, and stay on the right side of FAIS, POPIA, FICA, TCF and Discovery marketing rules.

---

## 1. What this business actually is

Execuneed is not an insurer. It is a relationship + advice + distribution practice that places Discovery products and gets paid via commission / trail / integration incentives.

Public positioning (from their own LinkedIn):

> Turning financial complexity into clarity, confidence, and long-term security for families.

Known people and contact points:
- Wayne Martens — adviser / public face
- Denise — Admin Manager (the operational bottleneck)
- Phone: 021 552 8989
- Email seen publicly: john@execuneed.co.za
- Offices: Century City (1 Bridgeway / Bridgeway Blvd) and Melkbosstrand / Atlantic Beach Golf Estate
- Founded 1985

Known product conversations they already run:
- Life cover, income protection, severe illness
- Retirement and long-term planning
- Discovery Bank cards + Vitality Travel / Miles
- Cover reviews (“complimentary review of current cover”)

Assume the full Discovery book is in scope unless they tell you otherwise:
- Discovery Health Medical Scheme + Gap Cover + Flexicare
- Discovery Life (Classic / Essential / Purple, disability, income, severe illness)
- Discovery Invest (RA, living annuity, endowment, global endowment, structured notes)
- Discovery Insure (car, home)
- Discovery Bank (accounts, cards)
- Vitality Health / Vitality Money
- Group Risk + employee benefits (B2B)

### The real commercial engine
1. New policies (upfront commission)
2. Annual / life-event reviews (the highest-ROI activity they are probably under-doing)
3. Cross-sell via Discovery integration discounts (Health + Life + Bank + Vitality stacked)
4. Referrals from existing families
5. Employer / group conversations
6. Claims and service excellence that protects persistency (trail)

AI should be pointed at those six, not at “a chatbot that talks about insurance.”

---

## 2. Problems this platform must kill

Typical Discovery practice pain. Design as if all of these are true:

| Problem | What it costs them | System answer |
|---|---|---|
| Website is a brochure / currently 503 | No inbound machine | High-conversion site + tools + WhatsApp |
| “Call us” is the only CTA | Unqualified noise for Denise | Structured intake + scoring + booking |
| Follow-up lives in someone’s head / WhatsApp | Dead leads | Pipeline + sequences + SLA |
| Reviews are ad-hoc | Missed premium and integration revenue | Review engine + life-event triggers |
| Advice files are messy | FSCA / complaint risk | FNA + RoA + document vault |
| Product content is hard to keep approved | Discovery marketing desk risk | Content CMS with approval workflow |
| Client calls for everything | Admin time | Client portal + status tracker |
| Commission vs work done is opaque | Cashflow anxiety | Book dashboard + expected commission |
| Marketing is random LinkedIn posts | No daily lead flow | Content + SEO/GEO + paid + referral |
| AI “advice” would be illegal | Debarment risk | AI = education + draft + ops, never licensed advice |

---

## 3. Hard legal constraints (build these in from day 1)

Do not treat these as footer text. They shape architecture.

### 3.1 Discovery website / branding rules (GC / DFP)
- Do **not** put “Discovery” in the domain, email addresses, or social handles.
- Use Execuneed look-and-feel + the **generic Discovery logo**, same size as the Execuneed logo.
- Homepage must carry the juristic representative disclaimer, e.g.  
  `Execuneed Financial Services is a juristic representative of Discovery Life Limited, registration number 1966/003901/06, a registered long-term insurer and an authorised financial services and registered credit provider, NCR Reg No. NCRCP3555. Product rules, terms and conditions apply.`  
  Confirm exact legal name, FSP number, NCR number and which Discovery entity they sit under before publishing.
- Any page that names Discovery products/benefits must go through Discovery Marketing Support (Adviser 360) before go-live.
- Host Conflict of Interest policy and Complaints policy (Discovery group versions + practice process).
- Do not imply Execuneed is Discovery, or that they underwrite anything.

### 3.2 FAIS / TCF
- AI must never output a product recommendation as advice.
- Needs analysis, Record of Advice, risk profile, and recommendation justification are **adviser-owned**.
- AI may draft; a licensed representative must review, edit, and sign.
- Keep records of advice and interactions for at least 5 years.
- Advice given even if the client does not take up a product still needs a file.
- TCF: products recommended must be suitable; communications fair and clear; complaints handled.

### 3.3 POPIA
- Collect minimum data for the stated purpose.
- Separate **service / advice processing** from **direct marketing**.
- Electronic marketing (email, SMS, WhatsApp, phone as electronic) needs opt-in or existing-customer soft opt-in.
- First contact with a cold prospect cannot be a promo blast. Consent first, or they contacted you.
- Every marketing message: sender identity + working opt-out.
- No purchased lists.
- PAIA / privacy policy, cookie consent, operator agreements with any AI/cloud vendor.
- Data residency: prefer EU/SA-friendly processors; document where data lives.
- WhatsApp is a record. Archive it into the CRM. Do not leave client files on personal phones.

### 3.4 FICA / KYC
- Onboarding vault for ID, proof of address, source of funds where required.
- Do not let the public site collect full FICA packs until a human has accepted the lead.

### 3.5 The AI rule of the platform
> Public AI educates and captures. Internal AI drafts and routes. Only a licensed person advises, recommends, and submits.

Label every AI output: “Educational / draft — not financial advice.”

---

## 4. Recommended system architecture

Three surfaces, one backend.

```
┌──────────────────────────────────────────────────────────┐
│ PUBLIC SITE  execuneed.co.za                             │
│ Marketing, education, tools, booking, WhatsApp, SEO/GEO  │
└───────────────────────────┬──────────────────────────────┘
                            │ leads / events
┌───────────────────────────▼──────────────────────────────┐
│ PLATFORM API  (Next.js + tRPC/REST + Postgres)           │
│ Auth, CRM, pipeline, compliance, content, AI orchestration│
└───────┬─────────────────────────┬────────────────────────┘
        │                         │
┌───────▼────────┐       ┌────────▼─────────┐
│ CLIENT PORTAL  │       │ STAFF ADMIN      │
│ household view │       │ Denise + advisers│
│ docs, requests │       │ KI / compliance  │
│ review booking │       │ N3XUS ops        │
└────────────────┘       └──────────────────┘
        │                         │
        └──────────┬──────────────┘
                   ▼
        AI layer (RAG + agents + queues)
        WhatsApp Cloud API
        Email / SMS
        Calendar
        E-sign
        Storage (encrypted)
        Optional later: Discovery FAZ / commission CSV import
```

### Suggested stack (Claude Code friendly)
- **Web:** Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui
- **CMS:** Payload CMS or a locked-down custom admin (better than WordPress for this)
- **DB:** Postgres + Prisma
- **Auth:** Clerk or Better Auth — role based (public, client, adviser, admin, compliance, superadmin)
- **Queue:** Inngest or Trigger.dev for sequences, reminders, daily lead jobs
- **AI:** Anthropic Claude for drafting + structured extraction; embeddings in pgvector for RAG
- **Files:** S3-compatible with encryption, virus scan, signed URLs
- **Chat:** WhatsApp Cloud API (primary in SA) + site widget that hands off
- **E-sign:** DocuSign / SignRequest / local equivalent
- **Analytics:** Plausible or PostHog (no client financial data in marketing analytics)
- **Hosting:** Vercel + Neon/Supabase Postgres, or Railway. Separate prod.
- **Observability:** audit log table for every AI call, every status change, every document access

Do **not** put raw client financials into a consumer chatbot vendor that trains on prompts.

---

## 5. Public website — information architecture

Premium, calm, Cape Town professional. Not “insurance quote factory.”  
Think private-client practice that happens to use Discovery.

### Pages
1. Home
2. How we work (process, not products)
3. Families
4. Professionals / business owners
5. Employers (group risk / employee benefits) — later phase if they want B2B
6. Services hub
   - Medical aid & gap
   - Life & income protection
   - Investments & retirement
   - Car & home
   - Banking & Vitality
7. Cover review (hero conversion page)
8. Tools (lead magnets)
   - Protection gap estimator (education, not a quote)
   - Retirement gap estimator
   - Medical aid comparison explainer
   - Integration savings explainer (“why stacking Discovery products changes the premium”)
9. Insights / journal (SEO + GEO)
10. About / team
11. Client stories (with consent)
12. FAQs
13. Contact / book
14. Legal: Privacy, PAIA, Terms, Complaints, Conflict of Interest, Disclosures, Cookie policy
15. Campaign landers (Bank card, Vitality Travel, year-end RA, medical aid switch season)

### Homepage narrative
1. Clarity for families. Not product dump.
2. “Most people are under-protected or overpaying — and they only find out at a claim or a life event.”
3. Complimentary structured review.
4. Proof: years since 1985, Cape Town presence, Discovery partnership handled correctly.
5. How a review works in 4 steps.
6. Tools.
7. Team.
8. Book on WhatsApp or calendar.

### Primary CTAs (in this order)
1. Book a complimentary cover review
2. WhatsApp the practice
3. Use a calculator (captures email + consent)
4. Download a one-pager (consent)

Never only “Call 021…”

### Conversion objects on every key page
- Sticky WhatsApp
- Short form: name, mobile, need type, best time, marketing consent checkbox separate from “please contact me about my enquiry”
- Calendar embed for Wayne / assigned adviser
- “What happens next” microcopy to reduce fear

---

## 6. The daily lead machine

“Generate leads daily” is a system, not a chatbot.

### 6.1 Inbound (compounding)
- Technical SEO + local SEO (Century City, Melkbosstrand, Table View, Atlantic Beach, Cape Town financial adviser)
- GEO: pages structured so ChatGPT / Gemini / Google AI Overviews cite Execuneed for “Discovery financial adviser Cape Town”
- Journal topics that match real search intent:
  - Changing medical aid in October
  - Gap cover vs hospital plan
  - RA contribution before tax year end
  - Income protection vs emergency fund
  - Discovery integration discounts explained
  - Buying a home and updating cover
  - Starting a business — key person / overheads
- Unique tools indexed and shared
- Google Business Profile + review flywheel
- YouTube / short vertical explainers later (repurposed from journal)

### 6.2 Conversational capture
- Site AI concierge trained **only** on approved content
- WhatsApp AI that:
  - Greets
  - Classifies intent (review / new cover / claim / service / Bank card / employer)
  - Collects 8–12 qualifying fields
  - Offers a calendar slot
  - Hands to human if advice, complaint, claim, or distress
- After hours: book or take a message. Never invent premiums.

### 6.3 Always-on campaigns
- Medical aid switch season lander (Sep–Dec)
- Tax-year-end RA lander (Jan–Feb)
- New school year / new baby / new home life-event content
- Discovery Bank + Vitality Travel campaign pages (they already post this)
- Review reactivation: “last review > 12 months”

### 6.4 Referral engine (highest quality leads)
- After onboarding + 30 days + after a claim assist: ask for 2 names
- Personalised WhatsApp referral card
- Optional: small non-cash thank-you that FAIS conflict rules allow (check COI policy — do not improvise gifts)

### 6.5 Paid (N3XUS Grow)
- Google Ads on high-intent: “Discovery broker Cape Town”, “medical aid adviser Century City”
- Meta for life-event creative, not scare tactics
- Lead forms that write into the CRM with consent flags
- Call tracking numbers that log into the lead record

### 6.6 Employer outbound (optional phase)
- Light CRM for SMEs in Century City / West Coast
- One-pager on group risk + medical aid + Vitality for staff
- AI drafts first email; human sends

### 6.7 What “daily leads” looks like operationally
A morning digest to Wayne + Denise:
- New web / WhatsApp leads overnight
- Leads going cold (no touch in 24h / 72h)
- Reviews due this week
- Content published / ads spend
- Booked meetings today
- AI-suggested next action on each open deal

Target state after 90 days of content + tools + WhatsApp:
- 3–8 qualified conversations per working day is realistic for a local practice if SEO + paid + reactivation run together.
- Do not promise a vanity “100 leads/day.” Promise a **qualified meeting machine**.

---

## 7. Lead object and qualification (build this first)

```ts
type Lead = {
  source: 'web' | 'whatsapp' | 'phone' | 'referral' | 'ads' | 'review_campaign' | 'event'
  intent: 'cover_review' | 'medical_aid' | 'life' | 'income' | 'invest_ra' | 'insure' | 'bank' | 'claim' | 'service' | 'employer'
  person: { name, mobile, email, suburb }
  household?: { adults, children, existingDiscovery: boolean }
  lifeEvents?: string[]
  consent: { contactForEnquiry: boolean, marketing: boolean, channel: ('whatsapp'|'email'|'phone')[] }
  score: number
  status: 'new' | 'qualified' | 'booked' | 'advice_in_progress' | 'submitted' | 'won' | 'lost' | 'nurture'
  assignedTo?: UserId
  slaDueAt: Date
}
```

### Scoring (simple, visible)
+3 cover review request  
+3 existing Discovery client (integration / switch gold)  
+2 life event in last 12 months  
+2 household with children  
+2 business owner  
+2 booked a slot themselves  
+1 Cape Town metro  
−2 “just browsing rates” with no callback window  
−5 complaint / claim (route to service, not sales)

SLA:
- Score ≥ 7: human WhatsApp in 15 minutes office hours
- Else: AI acknowledges immediately, human in 4 business hours
- No touch 24h: escalate to Denise

---

## 8. Admin platform — modules

Build as one app with roles.

### 8.1 Command centre
- Today’s meetings
- New leads
- SLA breaches
- Reviews due
- Outstanding FICA / signatures / outstanding Discovery submissions
- Complaints open
- AI queue (drafts waiting for human approval)

### 8.2 CRM / households
- Person + household + employer
- Product inventory (what they already have, even if non-Discovery)
- Vitality status if known
- Relationship map (spouse, kids, business)
- Timeline of every call, WhatsApp, email, meeting, document, AI draft
- Tags: HNWI, medical-aid-only, Bank-only, at-risk persistency, referred-by

### 8.3 Pipeline
Kanban + list:
`New → Qualified → Meeting booked → FNA started → Recommendation drafted → Client considering → Submitted to Discovery → In underwriting → Issued → Onboarded → Review cycle`

Loss reasons required (price, inertia, went direct, not ready, competitor).

### 8.4 Diary and meeting intelligence
- Calendar sync
- Prep brief generated from household file 1 hour before meeting
- Optional: meeting recorder → transcript → structured notes (store notes, decide with compliance whether audio is kept)
- Auto tasks: send recap, request docs, book medicals, follow up

### 8.5 Advice workbench (the FAIS heart)
Guided flow the adviser completes:
1. Client objectives
2. Financial position (income, expenses, assets, liabilities, dependants)
3. Existing cover / investments
4. Risk attitude
5. Needs analysis modules (life, disability, income, illness, medical, retirement, short-term, estate liquidity)
6. Options considered
7. Recommendation + why suitable + why not alternatives
8. Fees / commission disclosure
9. Conflicts
10. Client decision
11. Record of Advice PDF
12. E-sign
13. File lock + retention clock

AI role: pre-fill from lead form + meeting notes; draft RoA in practice voice; flag missing TCF fields.  
Adviser role: edit and accept.

### 8.6 Document vault
Folders per household:
- ID / FICA
- Quotes
- Applications
- RoA / FNA
- Policy schedules
- Claims
- Correspondence
OCR + AI classify on upload.  
Access logged.

### 8.7 Service & claims desk
Because persistency dies in service.
- Ticket types: policy change, beneficiary, claim assist, billing, Vitality, Bank, medical aid query
- Status shared to client portal
- Templates for “we have logged this with Discovery, here is what happens next”
- AI first-draft replies from knowledge base

### 8.8 Review engine
The quiet money printer.
- Every issued policy gets a next-review date (default 12 months, or at life event)
- Campaigns: 60 / 30 / 7 day sequences
- Review agenda auto-built from products + family changes
- Track review completion % as a KPI on the dashboard

### 8.9 Compliance cockpit (for KI / Denise)
- Rep register: qualifications, RE5, COB, product training, CPD hours, supervision status
- COI declarations
- Complaints register (FAIS format)
- Marketing approval log (which page, who approved at Discovery, date)
- AI audit log
- POPIA: consent register, opt-outs, data subject request workflow
- Retention / destruction calendar

### 8.10 Book & commission (phase 2)
- Policies on book
- Expected vs received commission (CSV import from Discovery to start — do not wait for an official API)
- Persistency flags
- Pipeline value
- Do not build a full accounting system. Build visibility.

### 8.11 Content / campaign CMS
- Pages, landers, journal
- Disclaimer blocks locked
- “Needs Discovery approval” checkbox + file of approval email
- UTM + conversion tracking

### 8.12 Team OS
- Tasks
- Mentions
- WhatsApp assignment so Denise is not the single point of failure
- After-hours rules

---

## 9. Client portal (phase 1.5)

Login by magic link / OTP (these clients will not remember passwords).

They can:
- See household snapshot (products they told you about / you placed)
- Upload requested docs
- Book a review
- Open a service request
- Sign documents
- Read “what we are waiting on from Discovery”
- Update contact details and marketing prefs
- Refer a family member

They cannot:
- Get an AI-generated “you should buy X cover of R4m”

---

## 10. AI feature catalogue (do everything useful, nothing reckless)

### Public
1. Concierge chatbot (RAG on approved pages only)
2. WhatsApp qualifier + booking
3. Calculator narratives (“here is what this number means — an adviser will model this properly”)
4. Article Q&A
5. Form assist / voice-to-form on mobile

### Adviser
6. Meeting prep brief
7. Meeting notes → structured CRM fields
8. Draft Record of Advice
9. Draft recommendation rationale (must be edited)
10. Draft client recap email / WhatsApp
11. Gap analysis vs stated goals (flag only)
12. Product explainer pull from approved knowledge base
13. Objection / education snippets
14. Compare “current cover vs stated need” as a checklist, not a sale

### Ops / Denise
15. Classify inbound (sales vs service vs complaint vs claim)
16. First-draft replies
17. Document classification + missing-doc chase
18. SLA nags
19. Daily digest
20. Call / WhatsApp summary into the file

### Growth
21. Journal draft from an approved fact pack
22. Repurpose one article into LinkedIn + WhatsApp status + email
23. SEO brief generator
24. Review-reactivation copy
25. Landing page variants

### Compliance
26. “Is this copy advice?” classifier before publish
27. Missing disclosure detector on pages and RoA
28. Complaint severity triage
29. CPD / fit-and-proper reminder drafts

### Explicitly out of scope
- Instant premiums presented as binding quotes
- “Best plan for you is Classic Comprehensive”
- Automated application submission to Discovery
- Scraping competitor quotes
- Cold WhatsApp blasts to scraped numbers
- Training public models on client files

---

## 11. Knowledge base (RAG) design

Three corpora, different permissions:

| Corpus | Contains | Used by |
|---|---|---|
| Public approved | Website, FAQs, approved product explainers, process | Site + WhatsApp bot |
| Practice private | How Execuneed works files, templates, checklists | Staff AI only |
| Client file | That household only | Staff AI in that record’s context |

Never mix client A into client B prompts.  
Never let public bot see practice private or client files.  
Cite sources in staff drafts.

Keep a `ContentApproval` table: source, version, approvedBy, approvedAt, discoveryTicketId.

---

## 12. Core user journeys to implement first

### Journey A — New family, cover review
1. Sees review page or calculator
2. Books or WhatsApps
3. AI qualifies, consent captured
4. Denise/Wayne gets card in admin
5. Prep brief generated
6. Meeting
7. Notes → FNA draft
8. Adviser finalises RoA
9. Client e-signs
10. Application pack assembled
11. Submitted (manual into Discovery systems)
12. Underwriting tracker
13. Issued → vault + review date + thank you + referral ask
14. Portal access

### Journey B — Existing client service
1. WhatsApp “my medical aid card isn’t working”
2. AI tags service, not sales
3. Ticket + missing info request
4. Denise works it
5. Client sees status
6. Closed with note in file

### Journey C — Annual review factory
1. Job runs daily: reviews due in 60 days
2. Personalised WhatsApp/email (marketing-consent aware; service reminder may be different legal basis — document this with their compliance officer)
3. Book
4. Updated FNA
5. Cross-sell only if suitable and recorded

### Journey D — Bank / Vitality campaign
1. Lander
2. Short form
3. Task: complete Bank adviser platform onboarding
4. Track “submitted / approved / card issued”
5. Then offer cover review (integration story)

---

## 13. Data model (minimum viable)

- User (roles)
- OrganisationSettings (legal names, FSP, disclaimers, brand)
- Person
- Household
- Lead
- PipelineDeal
- Meeting
- Interaction (channel, direction, body, aiSummary, rawRef)
- Consent
- Document
- AdviceFile (FNA + RoA versions)
- Policy
- Ticket
- Complaint
- Campaign
- ContentPage
- ContentApproval
- Task
- AuditEvent
- CommissionEntry
- KnowledgeChunk

Every table that touches a person: `createdBy`, `updatedBy`, timestamps, and audit on delete.

---

## 14. Design system direction

- Quiet luxury, not fintech purple-on-black
- Cape Town light, lots of whitespace, serif headings + clean sans body
- Photography: real families / Atlantic-seaboard / Century City — not stock handshakes
- Discovery generic logo present but Execuneed brand leads
- Accessibility, huge tap targets for 50+ clients
- Mobile first: most WhatsApp traffic is phone

Page speed matters for ads quality score and GEO.

---

## 15. Integrations map

### Phase 1
- WhatsApp Cloud API
- Google Calendar
- Email (Resend / Postmark)
- SMS (optional, Clickatell / Africa’s Talking)
- Google Analytics / Ads conversion API
- Meta lead ads
- S3
- E-sign

### Phase 2
- Discovery commission CSV
- Accounting export (Xero/Sage)
- Google Business reviews
- Voice transcription

### Do not block on
- Official Discovery product API for quotes/applications — assume it will stay human-in-the-loop via FAZ / Adviser 360 / Bank adviser platform

---

## 16. KPIs the dashboard should show

Growth
- Qualified leads / day
- Meeting booked rate
- Show-up rate
- Advice-to-submit rate
- Submit-to-issue rate
- Cost per booked meeting
- Organic vs paid vs referral mix

Book
- Reviews due / completed
- Integration opportunities identified
- Persistency / lapse watchlist
- Service tickets aging

Compliance
- Files with complete RoA
- Consents missing
- Complaints open
- Rep CPD / training expiry
- Unpublished pages waiting approval

Ops
- First response time
- Denise workload
- AI drafts accepted vs rewritten

---

## 17. Phased build for Claude Code

### Phase 0 — Discover (3–5 days, humans)
Confirm with Execuneed:
- Exact legal entity, FSP / juristic representative wording, KI names
- Products they are accredited to market
- Current tools (Excel, Outlook, WhatsApp-only, Astute, etc.)
- Who sells vs who admins
- Commission report format
- Whether they want employer business
- Brand assets
- Discovery marketing approval contact

### Phase 1 — Foundation (2–3 weeks)
- Next.js app, auth, roles, design system
- Public site: Home, How we work, Services overview, Review page, Contact, Legal pages with real disclaimers
- Lead form → CRM
- Admin: leads, household stub, tasks, diary link
- WhatsApp business number connected (even if human-only at first)
- Audit log
- Privacy + cookie + consent flags

Ship this live. A beautiful converting site + captured leads beats a clever bot on a 503.

### Phase 2 — Conversion + ops (2–3 weeks)
- Calculators
- WhatsApp qualifier bot (tight scope)
- Pipeline
- Document vault
- Client recap templates
- Review engine v1
- Daily digest
- Google Business + SEO skeleton + 8 cornerstone articles

### Phase 3 — Advice + portal (3–4 weeks)
- FNA / RoA workbench + e-sign
- Client portal
- Service desk
- Meeting notes AI
- Knowledge base RAG for staff

### Phase 4 — Growth system (ongoing retainer)
- Campaign landers
- Content engine
- Ads plumbing
- Referral
- Commission import
- GEO pages
- Employer module if wanted

Each phase is a Claude Code milestone with acceptance tests and a demo to Wayne + Denise.

---

## 18. Claude Code execution method

Do not dump this whole file at the model and say “build it.”

Repo layout:
```
/apps/web
/apps/admin   (or same app with route groups)
/packages/ui
/packages/db
/docs/PRODUCT.md          ← this brief
/docs/COMPLIANCE.md
/docs/PHASE-1.md
/docs/prompts/
```

Working style:
1. Paste only the current phase spec
2. Ask Claude Code to produce the data model + routes + UI for that phase
3. Add Playwright tests for lead capture, consent, and role access
4. Keep a `COMPLIANCE.md` open and require the model to update it when adding any user-facing financial copy
5. Product copy that mentions Discovery benefits goes into `/content/pending-approval` not straight to prod

Starter prompt for Phase 1 (adapt):

```
You are building Execuneed, a Cape Town Discovery-tied financial practice platform.
Read /docs/PRODUCT.md sections 3, 4, 5, 7, 13, 17 Phase 1.
Constraints:
- TypeScript, Next.js App Router, Prisma, Postgres, shadcn
- AI must not give product recommendations
- Every public page footer includes the juristic representative disclaimer from OrganisationSettings
- Lead form stores enquiry consent and marketing consent separately
- Roles: adviser, admin, compliance, superadmin
Deliver Phase 1 only. Do not scaffold later modules beyond empty nav items.
```

---

## 19. Commercial offer N3XUS can wrap around this

Matches N3XUS Core3:

**Build**
- Website operating system + admin + AI agents + WhatsApp

**Grow**
- SEO / GEO, Google + Meta, journal, landers, review reactivation

**Amplify**
- Later: Cape Town professional networks, golf estate / school partnerships, sponsor presence

Pricing logic for the practice:
- Build: fixed project by phase
- Monthly: platform + AI + WhatsApp + content + lead ops
- Optional ads spend with no media markup if that is still N3XUS policy

Internal upsell: this stack is reusable for other Discovery practices. Execuneed is the lighthouse case.

---

## 20. Risks and how to handle them

| Risk | Mitigation |
|---|---|
| Discovery rejects product copy | Education-first copy; approval workflow; generic benefits until approved |
| FSCA views chatbot as advice | Hard routing, disclaimers, no numbers that look like quotes |
| POPIA complaint from WhatsApp marketing | Consent register, opt-out, no bought lists |
| Denise does not adopt the tool | Design the admin around her day, not around engineering elegance. Train in person. |
| Advisers keep using private WhatsApp | Official number + “if it’s not in the system it didn’t happen” rule |
| Scope explosion | Phase 1 live in 3 weeks or the project dies |
| Hallucinated product rules | RAG only on approved corpus; refuse if not in corpus |
| Client data in model training | Zero-retention vendor contracts; no consumer ChatGPT for files |

---

## 21. First workshop agenda with Execuneed (90 minutes)

1. Confirm legal entity and what they may market
2. Map a real week for Wayne and Denise
3. Pull 20 recent WhatsApp threads and label intent
4. Pick 3 campaigns for the next quarter (Review, Medical aid season, Bank/Vitality)
5. Decide portal vs not for v1
6. Get brand, team photos, FSP wording, COI + complaints PDFs
7. Agree Phase 1 go-live date

---

## 22. Definition of done for the whole vision

Execuneed can run a week where:
- The site and WhatsApp produce booked conversations every weekday
- No lead sits untouched beyond SLA
- Every meeting has a file and a draft recap
- Every issued policy has a review date
- Denise spends time on exceptions, not copy-paste
- Wayne walks into meetings briefed
- A KI can export a compliance pack without panic
- Marketing is a calendar, not a mood
- AI is visibly saving hours and not creating regulatory heat

That is the product. Everything else is decoration.
