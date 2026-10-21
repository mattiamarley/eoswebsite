import 'server-only'
import { isAdmin } from '@/src/lib/security'
import { redirect } from 'next/navigation'
import { createClient } from './server'

/** Only server-managed app_metadata grants administrative access. */
export async function requireAdmin() {
  const supabase=await createClient()
  const {data:{user},error}=await supabase.auth.getUser()
  if(error||!user) redirect('/login')
  if(!isAdmin(user)) redirect('/login?error=unauthorized')
  return {supabase,user}
}
