import test from 'node:test'
import assert from 'node:assert/strict'
import {missingApplicationType,applicationLoadMessage} from '../src/lib/application-schema.ts'
test('recognizes only the confirmed additive application type migration gap',()=>{
 assert.equal(missingApplicationType({code:'42703',message:'column applications.application_type does not exist'}),true)
 assert.equal(missingApplicationType({code:'PGRST204',message:"Could not find application_type"}),true)
 for(const error of [null,{code:'42501',message:'permission denied application_type'},{code:'503',message:'application_type offline'},{code:'42703',message:'column email does not exist'}])assert.equal(missingApplicationType(error),false)
})
test('distinguishes missing schema from permissions and transient failures',()=>{
 assert.match(applicationLoadMessage({code:'42501'}),/permessi/)
 assert.match(applicationLoadMessage({code:'42703'}),/aggiornato/)
 assert.match(applicationLoadMessage({code:'503'}),/connessione/)
})

import {loadApplications} from '../src/utils/supabase/applications.ts'
function client(responses){
 const calls=[]
 return {calls,from(){const call={filters:[]};calls.push(call);const builder={select(columns){call.columns=columns;return builder},order(){return builder},eq(...args){call.filters.push(args);return builder},or(value){call.search=value;return builder},range(...args){call.range=args;return builder},abortSignal(){return Promise.resolve(responses[calls.length-1])}};return builder}}
}
const options={tab:'nuove',job:'12345678-1234-1234-1234-123456789abc',q:'Rossi',page:2}
const missing={data:null,error:{code:'42703',message:'column applications.application_type does not exist'},count:null}
test('legacy retry preserves candidates, job filters, search and pagination',async()=>{
 const expected=[{id:'candidate'}]
 const mock=client([missing,{data:expected,error:null,count:26}])
 const result=await loadApplications(mock,options)
 assert.equal(result.legacy,true);assert.deepEqual(result.data,expected)
 assert.equal(mock.calls.length,2);assert.ok(!mock.calls[1].columns.split(',').includes('application_type'))
 assert.deepEqual(mock.calls[1].filters,[['status','nuova'],['job_id',options.job]])
 assert.deepEqual(mock.calls[1].range,[25,49]);assert.match(mock.calls[1].search,/Rossi/)
})
test('permission failures never trigger a fallback query',async()=>{
 const denied={data:null,error:{code:'42501',message:'permission denied'},count:null}
 const mock=client([denied]);const result=await loadApplications(mock,options)
 assert.equal(result.legacy,false);assert.equal(result.error.code,'42501');assert.equal(mock.calls.length,1)
})
test('missing spontaneous filter is reported rather than fabricating an empty result',async()=>{
 const mock=client([missing]);const result=await loadApplications(mock,{...options,job:'spontaneous'})
 assert.equal(result.unsupportedFilter,true);assert.equal(result.count,null);assert.equal(mock.calls.length,1)
})
