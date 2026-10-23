import test from 'node:test'
import assert from 'node:assert/strict'
import {parseCompensation,formatSalary} from '../src/lib/job-compensation.ts'
function form(values={}){const f=new FormData();for(const [key,value] of Object.entries(values))f.set(key,value);return f}
test('compensation is optional and can be cleared',()=>assert.deepEqual(parseCompensation(form()),{seniority:null,salary_min:null,salary_max:null}))
test('fixed salary and range normalize into numeric euro amounts',()=>{
 assert.deepEqual(parseCompensation(form({seniority:'Junior',salary_min:'35000'})),{seniority:'Junior',salary_min:35000,salary_max:null})
 assert.equal(formatSalary({salary_min:35000,salary_max:45000}),'RAL 35K–45K €')
 assert.equal(formatSalary({salary_min:35500,salary_max:null}),'RAL 35.500 €')
 assert.equal(formatSalary({salary_min:null,salary_max:null}),'')
})
test('rejects reversed ranges, orphan maximum, negatives, decimals, huge amounts, unknown levels and files',()=>{
 for(const values of [{salary_min:'45000',salary_max:'35000'},{salary_max:'35000'},{salary_min:'-1'},{salary_min:'0'},{salary_min:'35000.50'},{salary_min:'1e5'},{salary_min:'5000001'},{seniority:'admin'},{salary_min:new Blob(['file'])}])assert.equal(parseCompensation(form(values)),null)
})
