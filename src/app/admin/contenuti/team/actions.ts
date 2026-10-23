'use server'

import { validRecordId, validContentForm } from '@/src/lib/security'
import { requireAdmin } from '@/src/utils/supabase/admin'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadImage, deleteImages } from '@/src/utils/supabase/storage'

export async function addMember(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{name:120,role:180,description:20000})) redirect('/admin/contenuti/team?error=invalid_input')

  const full_name = (formData.get('name') as string | null)?.trim() ?? ''
  const job_tag = (formData.get('role') as string | null)?.trim() || null
  const description = (formData.get('description') as string | null)?.trim() || null

  if (!full_name) redirect('/admin/contenuti/team?error=missing_name')

  // redirect() non va dentro try/catch: catturiamo l'errore prima di chiamarlo
  let uploaded: string | null = null
  let insertError: unknown = null
  try {
    const file = formData.get('image') as File | null
    const image_url = file && file.size > 0 ? await uploadImage(supabase, file) : null
    uploaded = image_url

    const { error } = await supabase
      .from('team_members')
      .insert({ full_name, job_tag, description, image_url })
    if (error) insertError = error
  } catch (err) {
    insertError = err
  }

  if (insertError) {
    if(uploaded) await deleteImages(supabase,[uploaded]).catch(()=>console.error('[addMember] cleanup failed'))
    console.error('[addMember]', insertError)
    redirect('/admin/contenuti/team?error=insert_failed')
  }

  revalidatePath('/admin/contenuti/team')
  revalidatePath('/studio')
}

export async function updateMember(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{name:120,role:180,description:20000})) redirect('/admin/contenuti/team?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/team?error=invalid_input')
  const full_name = (formData.get('name') as string | null)?.trim() ?? ''
  const job_tag = (formData.get('role') as string | null)?.trim() || null
  const description = (formData.get('description') as string | null)?.trim() || null

  if (!full_name) redirect(`/admin/contenuti/team?edit=${id}&error=missing_name`)

  let uploaded: string | null = null
  let updateError: unknown = null
  try {
    const { data: previous, error: readError } = await supabase.from('team_members').select('image_url').eq('id',id).single()
    if(readError||!previous) throw new Error('Membro non disponibile.')
    // Retain the trusted stored value when no replacement is uploaded.
    const file = formData.get('image') as File | null
    const image_url =
      file && file.size > 0
        ? await uploadImage(supabase, file)
        : previous.image_url || null
    if(file && file.size>0) uploaded=image_url

    const { error } = await supabase
      .from('team_members')
      .update({ full_name, job_tag, description, image_url })
      .eq('id', id)
    if (error) updateError = error
  } catch (err) {
    updateError = err
  }

  if (updateError) {
    if(uploaded) await deleteImages(supabase,[uploaded]).catch(()=>console.error('[updateMember] cleanup failed'))
    console.error('[updateMember]', updateError)
    redirect(`/admin/contenuti/team?edit=${id}&error=update_failed`)
  }

  revalidatePath('/admin/contenuti/team')
  revalidatePath('/studio')
  redirect('/admin/contenuti/team')
}

export async function deleteMember(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{name:120,role:180,description:20000})) redirect('/admin/contenuti/team?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/team?error=invalid_input')

  // Recuperiamo l'immagine collegata prima di eliminare la riga.
  const { data: member } = await supabase
    .from('team_members')
    .select('image_url')
    .eq('id', id)
    .single()

  let deleteError: unknown = null
  try {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) deleteError = error
  } catch (err) {
    deleteError = err
  }

  if (deleteError) {
    console.error('[deleteMember]', deleteError)
    redirect('/admin/contenuti/team?error=delete_failed')
  }

  // Pulizia best-effort del file orfano: non deve bloccare l'eliminazione.
  if (member?.image_url) {
    try {
      await deleteImages(supabase, [member.image_url])
    } catch (err) {
      console.error('[deleteMember] cleanup', err)
    }
  }

  revalidatePath('/admin/contenuti/team')
  revalidatePath('/studio')
}

export async function reorderTeam(ids: string[]) {
  const { supabase } = await requireAdmin()
  if (!Array.isArray(ids) || ids.length > 2000 || ids.some(id => !validRecordId(id)) || new Set(ids).size !== ids.length) {
    return {error: 'Ordine non valido.'}
  }
  const { error } = await supabase.rpc('reorder_team', {member_ids: ids})
  if (error) return {error: 'Impossibile salvare. Verifica la migrazione dell’ordine team oppure ricarica la pagina: il team potrebbe essere cambiato.'}
  revalidatePath('/admin/contenuti/team')
  revalidatePath('/studio')
  revalidatePath('/')
  return {success: true}
}
