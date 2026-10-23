'use server'

import { parseCompensation } from '@/src/lib/job-compensation'
import { hasJobCompensation } from '@/src/utils/supabase/job-schema'
import { validRecordId, validContentForm } from '@/src/lib/security'
import { requireAdmin } from '@/src/utils/supabase/admin'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type JobInput = {
  title: string
  category: string | null
  location: string | null
  description: string | null
  is_open: boolean
}

function parseJob(formData: FormData): JobInput {
  return {
    title: (formData.get('title') as string | null)?.trim() ?? '',
    category: (formData.get('category') as string | null)?.trim() || null,
    location: (formData.get('location') as string | null)?.trim() || null,
    description: (formData.get('description') as string | null)?.trim() || null,
    // La checkbox invia un valore solo quando è accesa.
    is_open: formData.get('is_open') !== null,
  }
}

export async function addJob(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,category:120,location:180,description:20000})) redirect('/admin/contenuti/lavoro?error=invalid_input')

  const compensation=parseCompensation(formData)
  if(!compensation) redirect('/admin/contenuti/lavoro?error=invalid_salary')
  let compensationEnabled=false
  try {compensationEnabled=await hasJobCompensation(supabase)}catch {redirect('/admin/contenuti/lavoro?error=load_failed')}
  if(!compensationEnabled && (compensation.seniority || compensation.salary_min!==null || compensation.salary_max!==null))redirect('/admin/contenuti/lavoro?error=schema_missing')
  const values = {...parseJob(formData),...(compensationEnabled?compensation:{})}
  if (!values.title) redirect('/admin/contenuti/lavoro?error=missing_title')

  // redirect() non va dentro try/catch: catturiamo l'errore prima di chiamarlo
  let insertError: unknown = null
  try {
    const { error } = await supabase.from('jobs').insert(values)
    if (error) insertError = error
  } catch (err) {
    insertError = err
  }

  if (insertError) {
    console.error('[addJob]', insertError)
    redirect('/admin/contenuti/lavoro?error=insert_failed')
  }

  revalidatePath('/admin/contenuti/lavoro')
  revalidatePath('/jobs')
}

export async function updateJob(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,category:120,location:180,description:20000})) redirect('/admin/contenuti/lavoro?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/lavoro?error=invalid_input')
  const compensation=parseCompensation(formData)
  if(!compensation) redirect('/admin/contenuti/lavoro?error=invalid_salary')
  let compensationEnabled=false
  try {compensationEnabled=await hasJobCompensation(supabase)}catch {redirect('/admin/contenuti/lavoro?error=load_failed')}
  if(!compensationEnabled && (compensation.seniority || compensation.salary_min!==null || compensation.salary_max!==null))redirect('/admin/contenuti/lavoro?error=schema_missing')
  const values = {...parseJob(formData),...(compensationEnabled?compensation:{})}
  if (!values.title) redirect(`/admin/contenuti/lavoro?edit=${id}&error=missing_title`)

  let updateError: unknown = null
  try {
    const { error } = await supabase.from('jobs').update(values).eq('id', id)
    if (error) updateError = error
  } catch (err) {
    updateError = err
  }

  if (updateError) {
    console.error('[updateJob]', updateError)
    redirect(`/admin/contenuti/lavoro?edit=${id}&error=update_failed`)
  }

  revalidatePath('/admin/contenuti/lavoro')
  revalidatePath('/jobs')
  redirect('/admin/contenuti/lavoro')
}

export async function toggleJobStatus(id: string, currentStatus: boolean) {
  const { supabase } = await requireAdmin()
  if (!validRecordId(id)) return

  try {
    const { error } = await supabase
      .from('jobs')
      .update({ is_open: !currentStatus })
      .eq('id', id)
    if (error) console.error('[toggleJobStatus]', error)
  } catch (err) {
    console.error('[toggleJobStatus]', err)
  }

  revalidatePath('/admin/contenuti/lavoro')
  revalidatePath('/jobs')
}

export async function deleteJob(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,category:120,location:180,description:20000})) redirect('/admin/contenuti/lavoro?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/lavoro?error=invalid_input')

  const {count:applications,error:applicationsError}=await supabase.from('applications').select('id',{count:'exact',head:true}).eq('job_id',id)
  if(applicationsError || applications) redirect('/admin/contenuti/lavoro?error=has_applications')
  let deleteError: unknown = null
  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) deleteError = error
  } catch (err) {
    deleteError = err
  }

  if (deleteError) {
    console.error('[deleteJob]', deleteError)
    redirect('/admin/contenuti/lavoro?error=delete_failed')
  }

  revalidatePath('/admin/contenuti/lavoro')
  revalidatePath('/jobs')
}
