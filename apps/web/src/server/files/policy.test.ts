import { describe, expect, it } from 'vitest'
import { buildUploadPolicy, objectKey, MAX_UPLOAD_BYTES } from './policy'

const req = {
  householdId: 'hh_1',
  filename: 'id-copy.pdf',
  contentType: 'application/pdf',
  sizeBytes: 1024,
}

describe('buildUploadPolicy', () => {
  it('never grants a public ACL', () => {
    const r = buildUploadPolicy(req)
    expect(r.ok && r.policy.acl).toBe('private')
    expect(r.ok && r.policy.serverSideEncryption).toBe('AES256')
  })

  it('expires the signed URL quickly', () => {
    const r = buildUploadPolicy(req)
    expect(r.ok && r.policy.ttlSeconds).toBeLessThanOrEqual(300)
  })

  it('refuses an upload with no household', () => {
    expect(buildUploadPolicy({ ...req, householdId: '' }).ok).toBe(false)
  })

  it('refuses oversized and empty files', () => {
    expect(buildUploadPolicy({ ...req, sizeBytes: MAX_UPLOAD_BYTES + 1 }).ok).toBe(false)
    expect(buildUploadPolicy({ ...req, sizeBytes: 0 }).ok).toBe(false)
  })

  it('refuses an executable disguised by name', () => {
    expect(buildUploadPolicy({ ...req, contentType: 'application/x-sh' }).ok).toBe(false)
  })
})

describe('objectKey', () => {
  it('namespaces by household', () => {
    expect(objectKey('hh_1', 'policy.pdf')).toBe('households/hh_1/policy.pdf')
  })

  it('cannot traverse out of the household prefix', () => {
    const key = objectKey('hh_1', '../../hh_2/secret.pdf')
    expect(key.startsWith('households/hh_1/')).toBe(true)
    expect(key).not.toContain('..')
    expect(key).not.toContain('hh_2/')
  })

  it('strips separators and exotic characters', () => {
    const key = objectKey('hh_1', 'a/b\\c d;rm -rf.pdf')
    expect(key.startsWith('households/hh_1/')).toBe(true)
    expect(key.slice('households/hh_1/'.length)).not.toMatch(/[/;]/)
  })
})
