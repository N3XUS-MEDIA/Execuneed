/**
 * P1-L-011 — upload policy. No upload UI ships in P1; this fixes the rules
 * before anything can be written, so P2's vault cannot quietly get them wrong.
 *
 * docs/compliance/RULES.md §FICA: the public site must not collect ID
 * documents. Uploads are staff-initiated only.
 */

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

export const ALLOWED_UPLOAD_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
] as const

export const SIGNED_URL_TTL_SECONDS = 300

export type UploadPolicy = {
  bucket: string
  key: string
  maxBytes: number
  allowedTypes: readonly string[]
  ttlSeconds: number
  /** Never 'public-read'. The bucket has no public ACL and never will. */
  acl: 'private'
  serverSideEncryption: 'AES256'
}

export type UploadRequest = {
  householdId: string
  filename: string
  contentType: string
  sizeBytes: number
}

export type PolicyResult =
  | { ok: true; policy: UploadPolicy }
  | { ok: false; reason: string }

/**
 * Object keys are namespaced by household so a signed URL can never be reused
 * to reach another family's file, and the filename is stripped of anything
 * that could traverse out of that prefix.
 */
export function objectKey(householdId: string, filename: string): string {
  const safe = filename
    .replace(/[/\\]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/[^\w.-]/g, '_')
    .slice(-120)
  return `households/${householdId}/${safe}`
}

export function buildUploadPolicy(req: UploadRequest): PolicyResult {
  if (!req.householdId) {
    return { ok: false, reason: 'Uploads must belong to a household.' }
  }
  if (req.sizeBytes <= 0 || req.sizeBytes > MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'File is empty or larger than 20MB.' }
  }
  if (!(ALLOWED_UPLOAD_TYPES as readonly string[]).includes(req.contentType)) {
    return { ok: false, reason: 'That file type is not accepted.' }
  }

  return {
    ok: true,
    policy: {
      bucket: process.env.S3_BUCKET ?? 'execuneed-docs',
      key: objectKey(req.householdId, req.filename),
      maxBytes: MAX_UPLOAD_BYTES,
      allowedTypes: ALLOWED_UPLOAD_TYPES,
      ttlSeconds: SIGNED_URL_TTL_SECONDS,
      acl: 'private',
      serverSideEncryption: 'AES256',
    },
  }
}
