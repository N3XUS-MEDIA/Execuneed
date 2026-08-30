'use client'

import { useId, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  Button,
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  Textarea,
  cn,
} from '@execuneed/ui'
import { copy, intentOptions } from '@/content/copy'
import { createLeadAction } from '@/server/leads/createLeadAction'
import type { ActionError } from '@/contracts/types'

/**
 * P1-S-025 / P1-S-030 — the public lead form.
 *
 * The two consent checkboxes are separate controls in a fieldset and neither
 * is pre-ticked. Submitting the form is not consent to market; that is what
 * the second box is for and why it has its own label and its own field.
 *
 * Errors are rendered next to their input and linked with aria-describedby,
 * with aria-invalid on the control, so a screen reader hears the reason rather
 * than just "invalid entry".
 *
 * Submission goes through onSubmit rather than `<form action>` on purpose.
 * React 19 resets the form once a form action resolves, which wiped every
 * field the moment validation failed — one mistyped digit and the visitor
 * started over. On the practice's main lead-capture page that is a conversion
 * bug, not a cosmetic one.
 *
 * The layout is grouped into three titled steps. It is the same fields in the
 * same order; a long unbroken column of inputs reads as more work than it is,
 * and this audience abandons on a phone.
 */
export function LeadForm({ source = 'web' }: { source?: string }) {
  const router = useRouter()
  const formId = useId()
  const [marketing, setMarketing] = useState(false)
  const [enquiry, setEnquiry] = useState(false)

  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<ActionError | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // The button is aria-disabled rather than disabled, so this is where the
    // gate is actually enforced on the client. Pressing it without the enquiry
    // box ticked moves focus to the box instead of doing nothing silently.
    if (!enquiry || pending) {
      document.getElementById(`${formId}-contactForEnquiry`)?.focus()
      return
    }

    const formData = new FormData(event.currentTarget)
    const channels = formData.getAll('channels').map(String)
    const raw = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName') || undefined,
      mobile: formData.get('mobile'),
      email: formData.get('email') || undefined,
      suburb: formData.get('suburb') || undefined,
      intent: formData.get('intent'),
      message: formData.get('message') || undefined,
      existingDiscovery:
        formData.get('existingDiscovery') === 'yes'
          ? true
          : formData.get('existingDiscovery') === 'no'
            ? false
            : undefined,
      children: formData.get('children') ? Number(formData.get('children')) : undefined,
      contactForEnquiry: formData.get('contactForEnquiry') === 'on',
      marketing: formData.get('marketing') === 'on',
      channels,
      source,
      website: formData.get('website') || undefined,
    }

    startTransition(async () => {
      const res = await createLeadAction(raw)
      if (res.ok) {
        router.push('/cover-review/thanks')
        return
      }
      setError(res.error)
      // Move to the first thing that needs fixing. Field keys match the control
      // ids. Focus rather than only scroll: without it the caret stays on the
      // submit button and, for anyone not looking at the screen, pressing it
      // appears to have done nothing at all.
      const firstField = res.error.fields ? Object.keys(res.error.fields)[0] : undefined
      if (firstField) {
        requestAnimationFrame(() => {
          const control = document.getElementById(`${formId}-${firstField}`)
          control?.scrollIntoView({ block: 'center' })
          control?.focus({ preventScroll: true })
        })
      }
    })
  }

  const fieldError = (name: string) => error?.fields?.[name]
  const errId = (name: string) => `${formId}-${name}-error`
  const describedBy = (name: string, ...extra: (string | undefined)[]) => {
    const ids = [...extra, fieldError(name) ? errId(name) : undefined].filter(Boolean)
    return ids.length ? ids.join(' ') : undefined
  }

  const FieldError = ({ name }: { name: string }) => {
    const msg = fieldError(name)
    if (!msg) return null
    return (
      <p id={errId(name)} className="text-sm font-medium text-danger">
        {msg}
      </p>
    )
  }

  const labelClass = 'font-medium text-ink'
  // The leading space matters: without it the accessible name of the field is
  // "Last nameOptional", which is what a screen reader reads out. Found in the
  // P2 keyboard and accessibility-tree pass.
  const optional = <span className="font-normal text-ink-muted"> — optional</span>

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10" data-testid="lead-form">
      {/* Announced whether or not it is on screen when it appears. */}
      <div aria-live="assertive">
        {error && !error.fields ? (
          <Alert tone="danger" title="We could not send that">
            {error.message}
          </Alert>
        ) : null}
        {/*
          Field errors are rendered beside their input, which is silent for
          anyone not looking at the screen. This says what happened; focus then
          moves to the field, which reads its own message out of
          aria-describedby.
        */}
        {error?.fields ? <p className="sr-only">{error.message}</p> : null}
      </div>

      {/*
        Honeypot. Off-screen rather than display:none, which some bots detect,
        and hidden from assistive tech so nobody real is ever asked to fill it.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <FormStep n="01" title="About you">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-firstName`} className={labelClass}>
              {copy.form.firstName}
            </label>
            <Input
              id={`${formId}-firstName`}
              name="firstName"
              required
              autoComplete="given-name"
              aria-invalid={Boolean(fieldError('firstName'))}
              aria-describedby={describedBy('firstName')}
            />
            <FieldError name="firstName" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-lastName`} className={labelClass}>
              {copy.form.lastName}
              {optional}
            </label>
            <Input id={`${formId}-lastName`} name="lastName" autoComplete="family-name" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-mobile`} className={labelClass}>
              {copy.form.mobile}
            </label>
            <Input
              id={`${formId}-mobile`}
              name="mobile"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              placeholder="082 123 4567"
              aria-invalid={Boolean(fieldError('mobile'))}
              aria-describedby={describedBy('mobile', `${formId}-mobile-hint`)}
            />
            <p id={`${formId}-mobile-hint`} className="text-sm text-ink-muted">
              A South African mobile — it is how we reach you.
            </p>
            <FieldError name="mobile" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-email`} className={labelClass}>
              {copy.form.email}
            </label>
            <Input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(fieldError('email'))}
              aria-describedby={describedBy('email')}
            />
            <FieldError name="email" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-suburb`} className={labelClass}>
              {copy.form.suburb}
              {optional}
            </label>
            <Input id={`${formId}-suburb`} name="suburb" autoComplete="address-level2" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-children`} className={labelClass}>
              Children at home
              {optional}
            </label>
            <Input
              id={`${formId}-children`}
              name="children"
              type="number"
              min={0}
              max={20}
              inputMode="numeric"
            />
          </div>
        </div>
      </FormStep>

      <FormStep n="02" title="What you need">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-intent`} className={labelClass}>
              {copy.form.intent}
            </label>
            <Select
              id={`${formId}-intent`}
              name="intent"
              required
              defaultValue="cover_review"
              aria-invalid={Boolean(fieldError('intent'))}
              aria-describedby={describedBy('intent')}
            >
              {intentOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <FieldError name="intent" />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className={cn(labelClass, 'mb-1')}>{copy.form.existing}</legend>
            <RadioGroup name="existingDiscovery" className="flex flex-row flex-wrap gap-x-8 gap-y-2">
              {[
                { v: 'yes', l: 'Yes' },
                { v: 'no', l: 'No' },
                { v: 'unsure', l: 'Not sure' },
              ].map((o) => (
                <div key={o.v} className="flex min-h-[44px] items-center gap-3">
                  <RadioGroupItem value={o.v} id={`${formId}-discovery-${o.v}`} />
                  <label htmlFor={`${formId}-discovery-${o.v}`}>{o.l}</label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-message`} className={labelClass}>
              {copy.form.message}
              {optional}
            </label>
            <Textarea
              id={`${formId}-message`}
              name="message"
              rows={5}
              maxLength={2000}
              aria-invalid={Boolean(fieldError('message'))}
              aria-describedby={describedBy('message')}
            />
            <FieldError name="message" />
          </div>
        </div>
      </FormStep>

      {/*
        Two separate permissions. POPIA treats handling this enquiry and
        sending marketing as different purposes, so they are different boxes
        and neither starts ticked.
      */}
      <FormStep n="03" title="Your permissions">
        <fieldset className="flex flex-col gap-5 rounded-lg border border-line bg-white p-5 sm:p-6">
          <legend className="sr-only">Your permissions</legend>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`${formId}-contactForEnquiry`}
                name="contactForEnquiry"
                checked={enquiry}
                onCheckedChange={(c) => setEnquiry(c === true)}
                aria-invalid={Boolean(fieldError('contactForEnquiry'))}
                aria-describedby={describedBy(
                  'contactForEnquiry',
                  `${formId}-enquiry-hint`,
                )}
              />
              <label htmlFor={`${formId}-contactForEnquiry`} className="leading-6 text-ink">
                {copy.form.consentEnquiry}
              </label>
            </div>
            <p id={`${formId}-enquiry-hint`} className="pl-9 text-sm text-ink-muted">
              Required — it is how we answer you.
            </p>
            <FieldError name="contactForEnquiry" />
          </div>

          <hr className="rule" />

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`${formId}-marketing`}
                name="marketing"
                checked={marketing}
                onCheckedChange={(c) => setMarketing(c === true)}
                aria-describedby={`${formId}-marketing-hint`}
              />
              <label htmlFor={`${formId}-marketing`} className="leading-6 text-ink">
                {copy.form.consentMarketing}
              </label>
            </div>
            <p id={`${formId}-marketing-hint`} className="pl-9 text-sm text-ink-muted">
              Entirely separate from the box above. Leave it unticked and we will only answer
              your enquiry.
            </p>

            {marketing ? (
              <fieldset className="ml-9 flex flex-col gap-2">
                <legend className="text-sm font-medium text-ink">
                  {copy.form.consentChannels}
                </legend>
                <div className="flex flex-wrap gap-x-8 gap-y-1">
                  {(
                    [
                      { value: 'whatsapp', label: 'WhatsApp' },
                      // Distinct from the "Email (optional)" field above, which
                      // otherwise gives two controls the same accessible name.
                      { value: 'email', label: 'Email me' },
                      { value: 'phone', label: 'Phone' },
                    ] as const
                  ).map((ch) => (
                    <div key={ch.value} className="flex min-h-[44px] items-center gap-3">
                      <Checkbox id={`${formId}-ch-${ch.value}`} name="channels" value={ch.value} />
                      <label htmlFor={`${formId}-ch-${ch.value}`}>{ch.label}</label>
                    </div>
                  ))}
                </div>
                <FieldError name="channels" />
              </fieldset>
            ) : null}
          </div>
        </fieldset>
      </FormStep>

      <div className="flex flex-col gap-4">
        {!enquiry ? (
          <p id={`${formId}-submit-blocked`} className="text-sm text-ink-muted">
            {copy.form.errorEnquiry}
          </p>
        ) : null}
        <Button
          type="submit"
          size="lg"
          aria-disabled={pending || !enquiry}
          aria-busy={pending}
          aria-describedby={!enquiry ? `${formId}-submit-blocked` : undefined}
          className="w-full aria-disabled:opacity-50 sm:w-auto sm:self-start sm:px-10"
        >
          {pending ? 'Sending…' : copy.form.submit}
        </Button>
        <p className="max-w-prose text-sm leading-relaxed text-ink-muted">
          We use these details to answer your enquiry and to arrange a conversation with a
          licensed adviser. No advice is given through this form.
        </p>
      </div>
    </form>
  )
}

/**
 * A numbered group. Purely presentational — the fields, their names and their
 * order are unchanged; this only breaks the column so the form does not read
 * as one long wall on a phone.
 */
function FormStep({
  n,
  title,
  children,
}: {
  n: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4 border-b border-line pb-4">
        <span className="font-heading text-lg font-semibold tracking-tight text-navy/65">{n}</span>
        <h3 className="text-lg text-ink">{title}</h3>
      </div>
      {children}
    </section>
  )
}
