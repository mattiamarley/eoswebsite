import test from 'node:test'
import assert from 'node:assert/strict'
import { missingProjectColumn } from '../src/lib/project-schema.ts'
test('recognizes the two optional missing schema columns',()=>{
 assert.equal(missingProjectColumn({code:'42703',message:'column projects.tags does not exist'}),'tags')
 assert.equal(missingProjectColumn({code:'PGRST204',message:"Could not find the 'is_featured' column"}),'is_featured')
})
test('never treats authorization, network or unrelated column errors as legacy schema',()=>{
 for(const error of [null,{code:'42501',message:'permission denied tags'},{code:'503',message:'tags unavailable'},{code:'42703',message:'column description does not exist'}])assert.equal(missingProjectColumn(error),null)
})
