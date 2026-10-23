import test from 'node:test'
import assert from 'node:assert/strict'
import {applicationInput,applicationDocumentPath} from '../src/lib/application-input.ts'
const id='12345678-1234-1234-1234-123456789abc'
function form(){const f=new FormData();for(const [k,v] of Object.entries({first_name:' Anna ',last_name:' Rossi ',email:'ANNA@example.it',job_id:id,privacy:'on'}))f.set(k,v);return f}
test('candidate data stays tied to the job and normalizes contacts',()=>{const input=applicationInput(form());assert.equal(input.applicant_name,'Anna Rossi');assert.equal(input.email,'anna@example.it');assert.equal(input.job_id,id);assert.equal(input.message,null)})
test('rejects missing names, invalid contacts, binary fields, oversized text and absent acknowledgement',()=>{for(const [key,value] of [['first_name',' '],['last_name',''],['email','bad'],['message','a'.repeat(3001)],['privacy',''],['job_id','bad'],['website','spam'],['phone',new Blob(['binary'])]]){const f=form();f.set(key,value);assert.equal(applicationInput(f),null)}})
test('documents must belong to the same application with a generated PDF path',()=>{assert.equal(applicationDocumentPath(`${id}/${id}.pdf`,id),`${id}/${id}.pdf`);for(const path of [`other/${id}.pdf`,`${id}/../../secret.pdf`,`https://evil.test/${id}.pdf`,`${id}/${id}.html`])assert.equal(applicationDocumentPath(path,id),null)})

import {applicationSizeError} from '../src/lib/application-limits.ts'
test('Netlify uploads stay below both per-file and combined limits',()=>{
 const mb=1024*1024
 assert.equal(applicationSizeError([{size:3*mb},{size:mb}]),null)
 assert.ok(applicationSizeError([{size:3*mb},{size:2*mb}]))
 assert.ok(applicationSizeError([{size:4*mb}]))
})
