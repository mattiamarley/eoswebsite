import {test} from 'node:test'
import assert from 'node:assert/strict'
import {parseProjectTags,projectLabels} from '../src/lib/project-tags.ts'
test('multiple labels are normalized and duplicates removed',()=>{
 assert.deepEqual(parseProjectTags(['Strutture','Architettura','Strutture']),['Architettura','Strutture'])
})
test('unknown or non-string labels are rejected',()=>{
 assert.throws(()=>parseProjectTags(['Inventata']))
 assert.throws(()=>parseProjectTags([{}]))
})
test('all labels can be cleared without restoring a generic category',()=>{
 assert.deepEqual(parseProjectTags([]),[])
 assert.deepEqual(projectLabels({tags:[],category:'Progetto EOS'}),[])
})
test('multi-label projects match both filters; legacy samples keep their category',()=>{
 const labels=projectLabels({tags:['Architettura','Strutture'],category:'Progetto EOS'})
 assert.ok(labels.includes('Architettura')&&labels.includes('Strutture'))
 assert.deepEqual(projectLabels({category:'Ambiente'}),['Ambiente'])
})
