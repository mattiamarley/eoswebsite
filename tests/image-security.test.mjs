import { test } from 'node:test'
import assert from 'node:assert/strict'
import { matchesImageSignature, publicImagePath } from '../src/lib/image-security.ts'

test('rejects HTML and SVG disguised as public images',()=>{
  for(const mime of ['image/png','image/jpeg','image/webp','image/svg+xml']) assert.equal(matchesImageSignature(new TextEncoder().encode('<svg onload='),mime),false)
  assert.equal(matchesImageSignature(new Uint8Array([137,80,78,71,13,10,26,10]),'image/png'),true)
  assert.equal(matchesImageSignature(new Uint8Array([255,216,255]),'image/jpeg'),true)
  assert.equal(matchesImageSignature(new TextEncoder().encode('RIFF0000WEBP'),'image/webp'),true)
})
test('only deletes images belonging to the configured storage origin',()=>{
  const origin='https://project.supabase.co'
  const prefix='/storage/v1/object/public/website-images/'
  assert.equal(publicImagePath(origin+prefix+'photo.webp',origin),'photo.webp')
  for(const url of ['https://user:password@project.supabase.co'+prefix+'photo.webp','https://evil.test'+prefix+'photo.webp',origin+prefix+'%2e%2e%2fsecret',origin+prefix+'%00',origin+prefix+'photo.webp?x=1','invalid']) assert.equal(publicImagePath(url,origin),null)
})
