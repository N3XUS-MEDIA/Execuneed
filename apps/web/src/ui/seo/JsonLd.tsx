/**
 * A single `application/ld+json` block.
 *
 * `<` is escaped on the way out. A name or a suburb typed by someone else
 * never reaches this component today, but the failure mode if it ever did — a
 * `</script>` inside a string closing the block early and turning the rest of
 * the page into markup — is bad enough to be worth four characters.
 *
 * The site's CSP allows this: `script-src` is `'self' 'unsafe-inline'` in
 * production (src/server/securityHeaders.ts), and a `ld+json` block is a data
 * block rather than executable script in any case.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
