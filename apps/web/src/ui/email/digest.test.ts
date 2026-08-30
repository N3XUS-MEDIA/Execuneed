import { describe, expect, it } from 'vitest'
import type { DigestData } from '@/server/jobs/dailyDigest'
import { digestSubject, escapeHtml, renderDigestHtml } from './digest'

/**
 * P2-S-044 — the digest template.
 *
 * The assertions that matter here are escaping and the empty states. This
 * email carries names typed into a public form by anyone on the internet, and
 * it is opened in staff mail clients.
 */

const at = new Date('2026-08-30T06:00:00.000Z') // 08:00 SAST

function lead(over: Partial<DigestData['newLeads'][number]> = {}) {
  return {
    id: 'lead_1',
    score: 3,
    intent: 'cover_review',
    slaDueAt: new Date('2026-08-30T05:00:00.000Z'),
    person: { firstName: 'Thandi', lastName: 'Mokoena', suburb: 'Century City' },
    ...over,
  } as DigestData['newLeads'][number]
}

function data(over: Partial<DigestData> = {}): DigestData {
  return {
    generatedAt: at,
    newLeads: [],
    breachedSla: [],
    openTasks: 0,
    ...over,
  } as DigestData
}

describe('escapeHtml', () => {
  it('escapes the characters that break out of markup', () => {
    expect(escapeHtml(`<script>"'&`)).toBe('&lt;script&gt;&quot;&#39;&amp;')
  })
})

describe('renderDigestHtml', () => {
  it('escapes a name that contains markup', () => {
    const html = renderDigestHtml(
      data({
        newLeads: [
          lead({ person: { firstName: '<img src=x onerror=alert(1)>', lastName: null, suburb: null } }),
        ],
      }),
      { baseUrl: 'https://example.test' },
    )

    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('escapes a suburb that contains markup', () => {
    const html = renderDigestHtml(
      data({
        newLeads: [
          lead({ person: { firstName: 'Sam', lastName: null, suburb: '"><b>Milnerton' } }),
        ],
      }),
    )
    expect(html).not.toContain('<b>Milnerton')
    expect(html).toContain('&lt;b&gt;Milnerton')
  })

  it('links each lead to its file when the app URL is set', () => {
    const html = renderDigestHtml(data({ newLeads: [lead({ id: 'abc123' })] }), {
      baseUrl: 'https://example.test',
    })
    expect(html).toContain('https://example.test/admin/leads/abc123')
  })

  it('renders names without links when there is no app URL', () => {
    // null, not undefined: undefined deliberately falls back to the environment.
    const html = renderDigestHtml(data({ newLeads: [lead()] }), { baseUrl: null })
    expect(html).not.toContain('/admin/leads/')
    expect(html).toContain('Thandi Mokoena')
  })

  it('says so plainly when nothing came in', () => {
    const html = renderDigestHtml(data(), { baseUrl: null })
    expect(html).toContain('Nothing new in the last 24 hours.')
  })

  it('omits the SLA block entirely when nothing has breached', () => {
    const html = renderDigestHtml(data({ newLeads: [lead()] }), { baseUrl: null })
    expect(html).not.toContain('Past SLA and still untouched')
  })

  it('puts the SLA breaches above the new leads', () => {
    const html = renderDigestHtml(
      data({
        newLeads: [lead()],
        breachedSla: [lead({ id: 'late_1', person: { firstName: 'Late', lastName: 'One', suburb: null } })],
      }),
      { baseUrl: null },
    )
    expect(html.indexOf('Past SLA and still untouched')).toBeLessThan(
      html.indexOf('New in the last 24 hours'),
    )
  })

  it('reports how late a breach is, in SAST', () => {
    const html = renderDigestHtml(
      data({
        breachedSla: [
          lead({ id: 'late_1', slaDueAt: new Date('2026-08-30T03:00:00.000Z') }),
        ],
      }),
      { baseUrl: null },
    )
    // Generated 06:00Z, due 03:00Z.
    expect(html).toContain('3 h late')
  })

  it('marks a high-scoring lead differently from a low one', () => {
    const high = renderDigestHtml(data({ newLeads: [lead({ score: 8 })] }), { baseUrl: null })
    const low = renderDigestHtml(data({ newLeads: [lead({ score: 2 })] }), { baseUrl: null })
    expect(high).not.toBe(low)
  })

  it('carries a preheader so the inbox preview is not the word Execuneed', () => {
    const html = renderDigestHtml(data({ newLeads: [lead()], openTasks: 4 }), { baseUrl: null })
    expect(html).toContain('1 new lead · 0 past SLA · 4 open tasks')
  })

  it('is a complete document with no unresolved template holes', () => {
    const html = renderDigestHtml(
      data({ newLeads: [lead()], breachedSla: [lead({ id: 'x' })], openTasks: 2 }),
      { baseUrl: 'https://example.test' },
    )
    expect(html.startsWith('<!doctype html>')).toBe(true)
    expect(html.trimEnd().endsWith('</html>')).toBe(true)
    expect(html).not.toContain('undefined')
    expect(html).not.toContain('[object Object]')
    expect(html).not.toContain('NaN')
  })

  it('keeps layout in tables, because Outlook renders through Word', () => {
    const html = renderDigestHtml(data({ newLeads: [lead()] }), { baseUrl: null })
    expect(html).toContain('role="presentation"')
    expect(html).not.toContain('display:flex')
    expect(html).not.toContain('display:grid')
  })
})

describe('digestSubject', () => {
  it('leads with the count', () => {
    expect(digestSubject(data({ newLeads: [lead(), lead()] }))).toBe('Execuneed digest — 2 new')
  })

  it('names a breach in the subject, because that is what needs opening', () => {
    expect(digestSubject(data({ newLeads: [lead()], breachedSla: [lead()] }))).toBe(
      'Execuneed digest — 1 new, 1 past SLA',
    )
  })
})
