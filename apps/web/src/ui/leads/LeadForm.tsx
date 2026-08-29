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
    })
  }

  const fieldError = (name: string) => error?.fields?.[name]
  const errId = (name: string) => `${formId}-${name}-error`

  const describedBy = (name: string) => (fieldError(name) ? errId(name) : undefined)

  const FieldError = ({ name }: { name: string }) => {
    const msg = fieldError(name)
    if (!msg) return null
    return (
      <p id={errId(name)} className="text-sm text-danger">
        {msg}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" data-testid="lead-form">
      {error && !error.fields ? (
        <Alert tone="danger" title="We could not send that">
          {error.message}
        </Alert>
      ) : null}

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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-firstName`}>{copy.form.firstName}</label>
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-lastName`}>{copy.form.lastName}</label>
          <Input id={`${formId}-lastName`} name="lastName" autoComplete="family-name" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-mobile`}>{copy.form.mobile}</label>
          <Input
            id={`${formId}-mobile`}
            name="mobile"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="082 123 4567"
            aria-invalid={Boolean(fieldError('mobile'))}
            aria-describedby={describedBy('mobile')}
          />
          <FieldError name="mobile" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-email`}>{copy.form.email}</label>
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-suburb`}>{copy.form.suburb}</label>
          <Input id={`${formId}-suburb`} name="suburb" autoComplete="address-level2" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-children`}>Children in the household</label>
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-intent`}>{copy.form.intent}</label>
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

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1">{copy.form.existing}</legend>
        <RadioGroup name="existingDiscovery" className="flex flex-row gap-6">
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-message`}>{copy.form.message}</label>
        <Textarea
          id={`${formId}-message`}
          name="message"
          maxLength={2000}
          aria-invalid={Boolean(fieldError('message'))}
          aria-describedby={describedBy('message')}
        />
        <FieldError name="message" />
      </div>

      {/*
        Two separate permissions. POPIA treats handling this enquiry and
        sending marketing as different purposes, so they are different boxes
        and neither starts ticked.
      */}
      <fieldset className="flex flex-col gap-4 rounded-md border border-line p-4">
        <legend className="px-1 text-sm text-ink-muted">Your permissions</legend>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`${formId}-contactForEnquiry`}
              name="contactForEnquiry"
              checked={enquiry}
              onCheckedChange={(c) => setEnquiry(c === true)}
              aria-invalid={Boolean(fieldError('contactForEnquiry'))}
              aria-describedby={describedBy('contactForEnquiry')}
            />
            <label htmlFor={`${formId}-contactForEnquiry`} className="leading-6">
              {copy.form.consentEnquiry}
            </label>
          </div>
          <FieldError name="contactForEnquiry" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`${formId}-marketing`}
              name="marketing"
              checked={marketing}
              onCheckedChange={(c) => setMarketing(c === true)}
            />
            <label htmlFor={`${formId}-marketing`} className="leading-6">
              {copy.form.consentMarketing}
            </label>
          </div>

          {marketing ? (
            <fieldset className="ml-9 flex flex-col gap-2">
              <legend className="text-sm text-ink-muted">{copy.form.consentChannels}</legend>
              <div className="flex flex-wrap gap-4">
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
                    <Checkbox
                      id={`${formId}-ch-${ch.value}`}
                      name="channels"
                      value={ch.value}
                    />
                    <label htmlFor={`${formId}-ch-${ch.value}`}>{ch.label}</label>
                  </div>
                ))}
              </div>
              <FieldError name="channels" />
            </fieldset>
          ) : null}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" disabled={pending || !enquiry}>
          {pending ? 'Sending…' : copy.form.submit}
        </Button>
        {!enquiry ? (
          <p className="text-sm text-ink-muted">{copy.form.errorEnquiry}</p>
        ) : null}
      </div>
    </form>
  )
}
