import { tokens } from '@execuneed/ui'
import type { DigestData } from '@/server/jobs/dailyDigest'

/**
 * P2-S-044 — the HTML half of the daily digest.
 *
 * `renderDigest` in src/server/jobs/dailyDigest.ts produces the plain-text
 * version and stays the fallback part of the multipart message. This is the
 * template only: Lead owns the send path, and there is no transport yet
 * (docs/handoffs/2026-08-29-lead-to-support-p2.md).
 *
 * Written the way email actually has to be written rather than the way the
 * site is:
 *
 *  - Tables for layout. Outlook on Windows renders through Word, which has no
 *    flexbox and no grid.
 *  - Styles inline on every element. Gmail strips much of a <style> block, so
 *    anything that must survive cannot live there. The block that is present
 *    carries only the responsive rules, which are a bonus rather than a
 *    requirement.
 *  - No web fonts. Montserrat is named first so it is used where it happens to
 *    be installed, with a real fallback stack behind it.
 *  - Colours come from `tokens`, so the mail matches the site and there is
 *    still one palette.
 *
 * Everything interpolated is escaped. This email contains client names typed
 * into a public form by whoever filled it in, and it is rendered in staff mail
 * clients.
 */

const c = tokens.color
const HEADING_STACK = "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif"
const BODY_STACK = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"

/** The digest is a work queue; the threshold is the one the SLA is set from. */
const HIGH_PRIORITY_SCORE = 7

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const sast = new Intl.DateTimeFormat('en-ZA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Africa/Johannesburg',
})

const sastTime = new Intl.DateTimeFormat('en-ZA', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Johannesburg',
})

function personName(p: { firstName: string; lastName: string | null }): string {
  return escapeHtml([p.firstName, p.lastName].filter(Boolean).join(' ')) || 'Unnamed'
}

function humanise(value: string): string {
  const words = value.replace(/_/g, ' ')
  return escapeHtml(words.charAt(0).toUpperCase() + words.slice(1))
}

/** How far past the deadline, in the words a person would use. */
function overdueBy(dueAt: Date, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - dueAt.getTime()) / 60000))
  if (minutes < 60) return `${minutes} min late`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} h late`
  return `${Math.round(hours / 24)} days late`
}

export function digestSubject(d: DigestData): string {
  const parts: string[] = []
  parts.push(`${d.newLeads.length} new`)
  if (d.breachedSla.length > 0) parts.push(`${d.breachedSla.length} past SLA`)
  return `Execuneed digest — ${parts.join(', ')}`
}

/**
 * The first line most mail clients show beside the subject. Without one they
 * show the top of the body, which here would be the word "Execuneed".
 */
function preheader(d: DigestData): string {
  const bits = [
    `${d.newLeads.length} new ${d.newLeads.length === 1 ? 'lead' : 'leads'}`,
    `${d.breachedSla.length} past SLA`,
    `${d.openTasks} open ${d.openTasks === 1 ? 'task' : 'tasks'}`,
  ]
  return escapeHtml(bits.join(' · '))
}

/**
 * `baseUrl` distinguishes three cases on purpose. Omitted falls back to the
 * environment; `null` means "there is no app URL, render plain names"; a string
 * is used as given. A single optional string could not express the middle case,
 * which is the one a test and a preview both need.
 */
export function renderDigestHtml(
  d: DigestData,
  { baseUrl }: { baseUrl?: string | null } = {},
): string {
  const resolved = baseUrl === undefined ? process.env.NEXT_PUBLIC_APP_URL : baseUrl
  const leadHref = (id: string) =>
    resolved ? `${resolved}/admin/leads/${encodeURIComponent(id)}` : null

  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(digestSubject(d))}</title>
<style>
  /* Progressive enhancement only. Anything that must survive is inline. */
  @media only screen and (max-width:600px){
    .stack{display:block !important;width:100% !important;}
    .pad{padding-left:20px !important;padding-right:20px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${c.sand};">
<div style="display:none;font-size:1px;color:${c.sand};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader(d)}</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${c.sand};">
<tr><td align="center" style="padding:24px 12px;">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:${c.paper};">

  <tr>
    <td class="pad" style="background-color:${c.navy};padding:24px 32px;">
      <p style="margin:0;font-family:${HEADING_STACK};font-size:18px;font-weight:700;letter-spacing:0.08em;color:${c.paper};text-transform:uppercase;">Execuneed</p>
      <p style="margin:6px 0 0;font-family:${BODY_STACK};font-size:14px;color:rgba(247,249,251,0.7);">Daily digest &middot; ${escapeHtml(sast.format(d.generatedAt))}, ${escapeHtml(sastTime.format(d.generatedAt))} SAST</p>
    </td>
  </tr>

  <tr>
    <td class="pad" style="padding:28px 32px 8px;">
      ${summaryRow(d)}
    </td>
  </tr>

  ${section('Past SLA and still untouched', slaBlock(d, leadHref), d.breachedSla.length > 0)}
  ${section('New in the last 24 hours', leadsBlock(d, leadHref), true)}

  <tr>
    <td class="pad" style="padding:28px 32px 28px;border-top:1px solid ${c.line};">
      <p style="margin:0;font-family:${BODY_STACK};font-size:12px;line-height:19px;color:${c.inkMuted};">
        This message contains client personal information and is for the named recipients only.
        It is an internal work queue: it makes no recommendation and is not a record of advice.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

/** The three numbers, so the first glance answers "is anything on fire". */
function summaryRow(d: DigestData): string {
  const cells: Array<{ label: string; value: string; tone: string }> = [
    { label: 'New leads', value: String(d.newLeads.length), tone: c.ink },
    {
      label: 'Past SLA',
      value: String(d.breachedSla.length),
      tone: d.breachedSla.length > 0 ? c.danger : c.ink,
    },
    { label: 'Open tasks', value: String(d.openTasks), tone: c.ink },
  ]

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      ${cells
        .map(
          (cell) => `<td class="stack" width="33%" style="padding:0 8px 0 0;vertical-align:top;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px solid ${c.line};">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0;font-family:${BODY_STACK};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${c.inkMuted};">${escapeHtml(cell.label)}</p>
            <p style="margin:6px 0 0;font-family:${HEADING_STACK};font-size:28px;font-weight:700;color:${cell.tone};">${escapeHtml(cell.value)}</p>
          </td></tr>
        </table>
      </td>`,
        )
        .join('')}
    </tr>
  </table>`
}

function section(title: string, body: string, show: boolean): string {
  if (!show) return ''
  return `<tr>
    <td class="pad" style="padding:24px 32px 0;">
      <p style="margin:0 0 12px;font-family:${BODY_STACK};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${c.inkMuted};">${escapeHtml(title)}</p>
      ${body}
    </td>
  </tr>`
}

function slaBlock(d: DigestData, leadHref: (id: string) => string | null): string {
  const now = d.generatedAt
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px solid ${c.line};border-left:3px solid ${c.danger};">
    ${d.breachedSla
      .map(
        (lead, i) => `<tr>
      <td style="padding:14px 18px;${i > 0 ? `border-top:1px solid ${c.line};` : ''}">
        ${nameCell(personName(lead.person), leadHref(lead.id))}
        <p style="margin:4px 0 0;font-family:${BODY_STACK};font-size:13px;color:${c.danger};">${escapeHtml(overdueBy(lead.slaDueAt, now))}</p>
      </td>
    </tr>`,
      )
      .join('')}
  </table>`
}

function leadsBlock(d: DigestData, leadHref: (id: string) => string | null): string {
  if (d.newLeads.length === 0) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px dashed ${c.line};">
      <tr><td style="padding:22px 18px;text-align:center;">
        <p style="margin:0;font-family:${BODY_STACK};font-size:14px;color:${c.inkMuted};">Nothing new in the last 24 hours.</p>
      </td></tr>
    </table>`
  }

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;border:1px solid ${c.line};">
    ${d.newLeads
      .map((lead, i) => {
        const high = lead.score >= HIGH_PRIORITY_SCORE
        const meta = [humanise(lead.intent), lead.person.suburb ? escapeHtml(lead.person.suburb) : null]
          .filter(Boolean)
          .join(' &middot; ')
        return `<tr>
      <td style="padding:14px 18px;${i > 0 ? `border-top:1px solid ${c.line};` : ''}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td width="44" style="vertical-align:top;padding-right:12px;">
              <div style="width:34px;height:24px;line-height:24px;text-align:center;font-family:${BODY_STACK};font-size:13px;font-weight:700;color:${high ? c.paper : c.ink};background-color:${high ? c.navy : c.sand};">${escapeHtml(String(lead.score))}</div>
            </td>
            <td style="vertical-align:top;">
              ${nameCell(personName(lead.person), leadHref(lead.id))}
              <p style="margin:4px 0 0;font-family:${BODY_STACK};font-size:13px;color:${c.inkMuted};">${meta}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
      })
      .join('')}
  </table>`
}

/** A name, linked to the lead file when the app URL is configured. */
function nameCell(name: string, href: string | null): string {
  if (!href) {
    return `<p style="margin:0;font-family:${BODY_STACK};font-size:15px;font-weight:600;color:${c.ink};">${name}</p>`
  }
  return `<p style="margin:0;font-family:${BODY_STACK};font-size:15px;font-weight:600;"><a href="${escapeHtml(href)}" style="color:${c.navy};text-decoration:underline;">${name}</a></p>`
}
