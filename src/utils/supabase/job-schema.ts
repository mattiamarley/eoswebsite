import type { createClient } from './server'
export async function hasJobCompensation(client:Awaited<ReturnType<typeof createClient>>):Promise<boolean> {
  const {error}=await client.from('jobs').select('seniority,salary_min,salary_max').limit(0).abortSignal(AbortSignal.timeout(5000))
  if(!error)return true
  if(['42703','PGRST204'].includes(error.code)&&/\b(seniority|salary_min|salary_max)\b/.test(error.message))return false
  throw error
}
