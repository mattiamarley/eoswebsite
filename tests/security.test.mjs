import test from 'node:test'
import assert from 'node:assert/strict'
import {safeAdminRedirect,isAdmin} from '../src/lib/security.ts'
test('accepts internal admin routes',()=>{
  assert.equal(safeAdminRedirect('/admin/contenuti/progetti'),'/admin/contenuti/progetti')
  assert.equal(safeAdminRedirect('/admin'),'/admin')
})
test('rejects external and ambiguous redirects',()=>{
  for(const value of ['https://example.com','//example.com','/\\example.com','/admin/../login','/admin%2f..','/administrator','/admin?to=https://example.com','/admin#test',null,{},'']) assert.equal(safeAdminRedirect(value),'/admin')
})
test('ordinary authenticated and anonymous users have no admin access',()=>{
  for(const user of [null,undefined,{}, {app_metadata:{}},{app_metadata:{role:'authenticated'}},{app_metadata:{role:'Admin'}}]) assert.equal(isAdmin(user),false)
})
test('user-editable metadata cannot elevate privileges',()=>{
  assert.equal(isAdmin({user_metadata:{role:'admin'}}),false)
})
test('server-managed admin role authorizes',()=>{
  assert.equal(isAdmin({app_metadata:{role:'admin'}}),true)
})

import { validRecordId, validContentForm } from '../src/lib/security.ts'
test('malformed IDs and oversized or binary text fields are rejected',()=>{
  assert.equal(validRecordId('2d65cbe2-26e0-4aa8-b30c-835117f26cd8'),true)
  for(const id of ['',null,'../admin','a?edit=1',{}]) assert.equal(validRecordId(id),false)
  const form=new FormData();form.set('title','EOS');assert.equal(validContentForm(form,{title:180}),true)
  form.set('title','a'.repeat(181));assert.equal(validContentForm(form,{title:180}),false)
  form.set('title',new Blob(['data']),'test');assert.equal(validContentForm(form,{title:180}),false)
})
