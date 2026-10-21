'use server'

import { getProjectSchema } from '@/src/utils/supabase/project-schema'
import { publicImagePath } from '@/src/lib/image-security'
import { parseProjectTags } from '@/src/lib/project-tags'
import { validRecordId, validContentForm } from '@/src/lib/security'
import { requireAdmin } from '@/src/utils/supabase/admin'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'
import { uploadImage, deleteImages } from '@/src/utils/supabase/storage'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/** URL già presenti (textarea, una per riga) + nuovi file caricati nello Storage. */
async function resolveImages(
  supabase: SupabaseServerClient,
  formData: FormData,
  allowed: string[] = [],
  uploaded: string[] = []
): Promise<string[]> {
  const values = formData.getAll('existing_images')
  if (values.some(value=>typeof value!=='string')) throw new Error('Immagine non valida.')
  const existing = [...new Set((values as string[]).map(value=>value.trim()).filter(Boolean))]
  if(existing.some(url=>!allowed.includes(url)||!publicImagePath(url,process.env.NEXT_PUBLIC_SUPABASE_URL))) throw new Error('Immagine non appartenente al progetto.')
  const files=formData.getAll('images')
  if(files.some(file=>!(file instanceof File))) throw new Error('File non valido.')
  if(existing.length+files.filter(file=>file instanceof File&&file.size>0).length>20) throw new Error('Massimo 20 immagini per progetto.')
  for (const file of formData.getAll('images') as File[]) {
    if (file && file.size > 0) uploaded.push(await uploadImage(supabase, file))
  }

  return [...existing, ...uploaded]
}

export async function addProject(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,description:20000})) redirect('/admin/contenuti/progetti?error=invalid_input')

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() || null
  if (!title) redirect('/admin/contenuti/progetti?error=missing_title')

  // redirect() non va dentro try/catch: catturiamo l'errore prima di chiamarlo
  const uploaded: string[] = []
  let insertError: unknown = null
  try {
    const tags = parseProjectTags(formData.getAll('tags'))
    const schema=await getProjectSchema(supabase)
    if((!schema.tags&&tags.length)||(!schema.is_featured&&formData.get('is_featured')==='on')) throw new Error('Aggiornamento database necessario.')
    const metadata={...(schema.tags?{tags}:{}),...(schema.is_featured?{is_featured:formData.get('is_featured')==='on'}:{})}
    const images = await resolveImages(supabase, formData, [], uploaded)
    const { error } = await supabase.from('projects').insert({ title, description, images, ...metadata })
    if (error) insertError = error
  } catch (err) {
    insertError = err
  }

  if (insertError) {
    if(uploaded.length) await deleteImages(supabase,uploaded).catch(()=>console.error('[addProject] cleanup failed'))
    console.error('[addProject]', insertError)
    redirect('/admin/contenuti/progetti?error=insert_failed')
  }

  revalidatePath('/admin/contenuti/progetti')
  revalidatePath('/portfolio')
  revalidatePath('/')
}

export async function updateProject(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,description:20000})) redirect('/admin/contenuti/progetti?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/progetti?error=invalid_input')
  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const description = (formData.get('description') as string | null)?.trim() || null
  if (!title) redirect(`/admin/contenuti/progetti?edit=${id}&error=missing_title`)

  const uploaded: string[] = []
  let updateError: unknown = null
  try {
    const tags = parseProjectTags(formData.getAll('tags'))
    const schema=await getProjectSchema(supabase)
    if((!schema.tags&&tags.length)||(!schema.is_featured&&formData.get('is_featured')==='on')) throw new Error('Aggiornamento database necessario.')
    const metadata={...(schema.tags?{tags}:{}),...(schema.is_featured?{is_featured:formData.get('is_featured')==='on'}:{})}
    const { data: previous, error: readError } = await supabase.from('projects').select('images').eq('id',id).single()
    if(readError||!previous) throw new Error('Progetto non disponibile.')
    const images = await resolveImages(supabase, formData, previous.images??[], uploaded)
    const { error } = await supabase
      .from('projects')
      .update({ title, description, images, ...metadata })
      .eq('id', id)
    if (error) updateError = error
  } catch (err) {
    updateError = err
  }

  if (updateError) {
    if(uploaded.length) await deleteImages(supabase,uploaded).catch(()=>console.error('[updateProject] cleanup failed'))
    console.error('[updateProject]', updateError)
    redirect(`/admin/contenuti/progetti?edit=${id}&error=update_failed`)
  }

  revalidatePath('/admin/contenuti/progetti')
  revalidatePath('/portfolio')
  revalidatePath('/')
  redirect('/admin/contenuti/progetti')
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin()
  if(!validContentForm(formData,{title:180,description:20000})) redirect('/admin/contenuti/progetti?error=invalid_input')

  const id = formData.get('id') as string
  if(!validRecordId(id)) redirect('/admin/contenuti/progetti?error=invalid_input')

  // Recuperiamo le immagini collegate prima di eliminare la riga.
  const { data: project } = await supabase
    .from('projects')
    .select('images')
    .eq('id', id)
    .single()

  let deleteError: unknown = null
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) deleteError = error
  } catch (err) {
    deleteError = err
  }

  if (deleteError) {
    console.error('[deleteProject]', deleteError)
    redirect('/admin/contenuti/progetti?error=delete_failed')
  }

  // Pulizia best-effort dei file orfani: non deve bloccare l'eliminazione.
  if (project?.images && project.images.length > 0) {
    try {
      await deleteImages(supabase, project.images)
    } catch (err) {
      console.error('[deleteProject] cleanup', err)
    }
  }

  revalidatePath('/admin/contenuti/progetti')
  revalidatePath('/portfolio')
  revalidatePath('/')
}
