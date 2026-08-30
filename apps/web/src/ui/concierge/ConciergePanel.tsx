'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Button, Checkbox, Input, Select, cn } from '@execuneed/ui'
import { copy, intentOptions } from '@/content/copy'
import { CONCIERGE_DISCLAIMER, concierge, conciergeServices } from '@/content/concierge'
import { createLeadAction } from '@/server/leads/createLeadAction'
import type { ActionError } from '@/contracts/types'

/**
 * The site concierge — the capture half of `P2-L-070`.
 *
 * It is a fixed script with no model behind it. Everything it can say lives in
 * `@/content/concierge`, and it answers no question at all: the ticket scopes
 * answering to content carrying a Discovery Marketing Support approval
 * reference, and there is no approved corpus yet
 * (docs/compliance/DISCOVERY_APPROVALS.md). Refusal is the ticket's stated
 * default when the corpus has nothing, and right now the corpus has nothing.
 *
 * What someone types is never answered. It is carried into the enquiry as the
 * message so the person calling back has already read the question.
 *
 * Consent is captured exactly as the web form captures it, because the ticket
 * says so and because POPIA does not care which surface collected it: two
 * fields, two checkboxes, neither pre-ticked, and the same wording from the
 * copy deck.
 */

type Turn = { from: 'bot' | 'user'; text: string }

/** The greeting and the limits. Anything beyond this is a real exchange. */
const INITIAL_TURNS = 2

type Step =
  | { name: 'menu' }
  | { name: 'services' }
  | { name: 'talk' }
  | { name: 'refused'; question: string }
  | { name: 'capture'; question?: string }
  | { name: 'sent' }

export function ConciergePanel({
  onClose,
  whatsappHref,
  labelledBy,
}: {
  onClose: () => void
  whatsappHref: string | null
  labelledBy: string
}) {
  const id = useId()
  const tel = copy.contact.phone.replace(/\s/g, '')
  const [turns, setTurns] = useState<Turn[]>(() => [
    { from: 'bot', text: concierge.greeting },
    { from: 'bot', text: concierge.limits },
  ])
  const [step, setStep] = useState<Step>({ name: 'menu' })
  const [draft, setDraft] = useState('')
  const transcriptRef = useRef<HTMLDivElement>(null)

  const say = (...next: Turn[]) => setTurns((t) => [...t, ...next])

  // Keep the newest turn in view without stealing focus from whatever the
  // visitor is doing — but not on the first render. Scrolling to the bottom
  // the moment it opens pushes the disclaimer and the greeting off the top,
  // which is the opposite of what someone opening it needs to read first.
  const opening = turns.length <= INITIAL_TURNS
  useEffect(() => {
    if (opening) return
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns, step, opening])

  function choose(label: string, to: Step, ...bot: string[]) {
    say({ from: 'user', text: label }, ...bot.map((text) => ({ from: 'bot' as const, text })))
    setStep(to)
  }

  function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = draft.trim()
    if (!question) return
    setDraft('')
    say(
      { from: 'user', text: question },
      { from: 'bot', text: concierge.refusal },
      { from: 'bot', text: concierge.refusalOffer },
    )
    setStep({ name: 'refused', question })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={transcriptRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5"
        aria-live="polite"
        aria-labelledby={labelledBy}
      >
        <p className="rounded-md border border-line bg-sand/50 p-3 text-xs leading-relaxed text-ink-muted">
          {CONCIERGE_DISCLAIMER}
        </p>

        <ol className="mt-4 flex flex-col gap-3">
          {turns.map((t, i) => (
            <li
              key={`${i}-${t.text.slice(0, 12)}`}
              className={cn('flex', t.from === 'user' ? 'justify-end' : 'justify-start')}
            >
              <p
                className={cn(
                  'max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed',
                  t.from === 'user'
                    ? 'bg-navy text-paper'
                    : 'border border-line bg-white text-ink',
                )}
              >
                <span className="sr-only">{t.from === 'user' ? 'You said: ' : 'Execuneed: '}</span>
                {t.text}
              </p>
            </li>
          ))}
        </ol>

        {step.name === 'services' ? (
          <ul className="mt-4 flex flex-col gap-2">
            {conciergeServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  onClick={onClose}
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-md border border-line bg-white px-3.5 text-ink hover:border-navy/40"
                >
                  {s.title}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
            <li className="mt-1">
              <p className="text-xs leading-relaxed text-ink-muted">{concierge.services.outro}</p>
            </li>
          </ul>
        ) : null}

        {step.name === 'talk' ? (
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={`tel:${tel}`}
              className="flex min-h-[44px] items-center justify-center rounded-md bg-navy px-4 font-medium text-paper"
            >
              {concierge.talk.call}
            </a>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center rounded-md border border-line bg-white px-4 text-ink"
              >
                {concierge.talk.whatsapp}
              </a>
            ) : null}
          </div>
        ) : null}

        {step.name === 'capture' ? (
          <CaptureForm
            idPrefix={`${id}-capture`}
            question={step.question}
            onSent={() => {
              say(
                { from: 'bot', text: concierge.sent.title },
                { from: 'bot', text: concierge.sent.body },
                { from: 'bot', text: concierge.sent.urgent },
              )
              setStep({ name: 'sent' })
            }}
          />
        ) : null}
      </div>

      {/* Nothing to offer in the capture step — the form is the affordance, and
          an empty bordered strip under it just looks like a mistake. */}
      {step.name === 'capture' ? null : (
      <div className="border-t border-line bg-paper px-4 py-3 sm:px-5">
        {step.name === 'menu' || step.name === 'services' || step.name === 'talk' ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Chip
                onClick={() =>
                  choose(concierge.options.book, { name: 'capture' }, concierge.capture.intro)
                }
              >
                {concierge.options.book}
              </Chip>
              <Chip
                onClick={() =>
                  choose(
                    concierge.options.services,
                    { name: 'services' },
                    concierge.services.intro,
                  )
                }
              >
                {concierge.options.services}
              </Chip>
              <Chip onClick={() => choose(concierge.options.talk, { name: 'talk' }, concierge.talk.body)}>
                {concierge.options.talk}
              </Chip>
            </div>

            <form onSubmit={ask} className="mt-3 flex gap-2">
              <label htmlFor={`${id}-ask`} className="sr-only">
                Ask a question
              </label>
              <Input
                id={`${id}-ask`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Or type your question"
                maxLength={2000}
                autoComplete="off"
              />
              <Button type="submit" aria-label="Send question" className="shrink-0 px-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                  aria-hidden="true"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </Button>
            </form>
          </>
        ) : null}

        {step.name === 'refused' ? (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                choose(
                  concierge.refusalAccept,
                  { name: 'capture', question: step.question },
                  concierge.capture.intro,
                )
              }
            >
              {concierge.refusalAccept}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                choose(
                  concierge.refusalDecline,
                  { name: 'menu' },
                  concierge.declined.replace('{phone}', copy.contact.phone),
                )
              }
            >
              {concierge.refusalDecline}
            </Button>
          </div>
        ) : null}

        {step.name === 'sent' ? (
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </div>
      )}
    </div>
  )
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[44px] items-center rounded-md border border-line bg-white px-3.5 text-sm text-ink transition-colors hover:border-navy/40"
    >
      {children}
    </button>
  )
}

/**
 * The same three things the public form needs to open a file, and the same two
 * consents. Deliberately not a second lead schema: it posts to
 * `createLeadAction`, which validates and rejects exactly as it does for the
 * form on /cover-review.
 */
function CaptureForm({
  idPrefix,
  question,
  onSent,
}: {
  idPrefix: string
  question?: string
  onSent: () => void
}) {
  const [enquiry, setEnquiry] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<ActionError | null>(null)

  const fieldError = (name: string) => error?.fields?.[name]
  const errId = (name: string) => `${idPrefix}-${name}-error`

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    if (!enquiry) {
      document.getElementById(`${idPrefix}-enquiry`)?.focus()
      return
    }

    const data = new FormData(event.currentTarget)
    startTransition(async () => {
      const res = await createLeadAction({
        firstName: data.get('firstName'),
        mobile: data.get('mobile'),
        intent: data.get('intent'),
        message: question || undefined,
        contactForEnquiry: enquiry,
        marketing,
        channels: marketing ? ['whatsapp'] : [],
        // There is no `chat` value in the LeadSource enum, and that enum is
        // Lead's. The website is where this arrived, so: web.
        source: 'web' as const,
      })

      if (res.ok) {
        onSent()
        return
      }
      setError(res.error)
      const first = res.error.fields ? Object.keys(res.error.fields)[0] : undefined
      if (first) document.getElementById(`${idPrefix}-${first}`)?.focus()
    })
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-4" data-testid="concierge-capture">
      {question ? (
        <div className="rounded-md border border-line bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
            {concierge.capture.questionLabel}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{question}</p>
        </div>
      ) : null}

      {error && !error.fields ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-firstName`} className="text-sm font-medium text-ink">
          {copy.form.firstName}
        </label>
        <Input
          id={`${idPrefix}-firstName`}
          name="firstName"
          autoComplete="given-name"
          aria-invalid={Boolean(fieldError('firstName'))}
          aria-describedby={fieldError('firstName') ? errId('firstName') : undefined}
        />
        {fieldError('firstName') ? (
          <p id={errId('firstName')} className="text-sm font-medium text-danger">
            {fieldError('firstName')}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-mobile`} className="text-sm font-medium text-ink">
          {copy.form.mobile}
        </label>
        <Input
          id={`${idPrefix}-mobile`}
          name="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="082 123 4567"
          aria-invalid={Boolean(fieldError('mobile'))}
          aria-describedby={fieldError('mobile') ? errId('mobile') : undefined}
        />
        {fieldError('mobile') ? (
          <p id={errId('mobile')} className="text-sm font-medium text-danger">
            {fieldError('mobile')}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-intent`} className="text-sm font-medium text-ink">
          {copy.form.intent}
        </label>
        <Select id={`${idPrefix}-intent`} name="intent" defaultValue="cover_review">
          {intentOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-line bg-white p-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`${idPrefix}-enquiry`}
              checked={enquiry}
              onCheckedChange={(c) => setEnquiry(c === true)}
              aria-describedby={`${idPrefix}-enquiry-hint`}
            />
            <label htmlFor={`${idPrefix}-enquiry`} className="text-sm leading-6 text-ink">
              {concierge.capture.consentEnquiry}
            </label>
          </div>
          <p id={`${idPrefix}-enquiry-hint`} className="pl-9 text-xs text-ink-muted">
            {concierge.capture.enquiryHint}
          </p>
        </div>

        <hr className="rule" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`${idPrefix}-marketing`}
              checked={marketing}
              onCheckedChange={(c) => setMarketing(c === true)}
              aria-describedby={`${idPrefix}-marketing-hint`}
            />
            <label htmlFor={`${idPrefix}-marketing`} className="text-sm leading-6 text-ink">
              {concierge.capture.consentMarketing}
            </label>
          </div>
          <p id={`${idPrefix}-marketing-hint`} className="pl-9 text-xs text-ink-muted">
            {concierge.capture.marketingHint}
          </p>
        </div>
      </div>

      {!enquiry ? (
        <p id={`${idPrefix}-blocked`} className="text-sm text-ink-muted">
          {concierge.capture.blocked}
        </p>
      ) : null}

      <Button
        type="submit"
        aria-disabled={pending || !enquiry}
        aria-busy={pending}
        aria-describedby={!enquiry ? `${idPrefix}-blocked` : undefined}
        className="w-full aria-disabled:opacity-50"
      >
        {pending ? concierge.capture.sending : concierge.capture.submit}
      </Button>

      <p className="text-xs leading-relaxed text-ink-muted">{concierge.capture.privacy}</p>
    </form>
  )
}
