import type { createClient } from './server'
import { missingProjectColumn, type ProjectSchema } from '@/src/lib/project-schema'

/** Only schema-missing errors trigger compatibility mode; authorization errors still fail. */
export async function getProjectSchema(client:Awaited<ReturnType<typeof createClient>>):Promise<ProjectSchema> {
  const schema:ProjectSchema={tags:true,is_featured:true}
  for(let attempt=0;attempt<3;attempt++) {
    const columns=['id',...(schema.tags?['tags']:[]),...(schema.is_featured?['is_featured']:[])].join(',')
    const {error}=await client.from('projects').select(columns).limit(0).abortSignal(AbortSignal.timeout(5000))
    if(!error)return schema
    const missing=missingProjectColumn(error)
    if(!missing||!schema[missing])throw error
    schema[missing]=false
  }
  throw new Error('Schema progetti non disponibile.')
}
