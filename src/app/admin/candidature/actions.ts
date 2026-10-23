'use server'

import { validRecordId } from '@/src/lib/security'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/src/utils/supabase/admin'

import { revalidatePath } from 'next/cache'

const VALID_STATUS = ['nuova', 'letta', 'in_valutazione'] as const

export async function toggleFavorite(formData: FormData) {
  const { supabase } = await requireAdmin()

  const id = formData.get('id') as string
  const current = formData.get('current') === 'true'
  if (!validRecordId(id)) return

  try {
    const { error } = await supabase
      .from('applications')
      .update({ is_favorite: !current })
      .eq('id', id)
    if (error) throw error
  } catch (err) {
    console.error('[toggleFavorite]', err)
    redirect('/admin/candidature?error=save_failed')
  }

  revalidatePath('/admin/candidature')
  revalidatePath('/admin')
}

export async function updateStatus(formData: FormData) {
  const { supabase } = await requireAdmin()

  const id = formData.get('id') as string
  const status = formData.get('status') as string
  if (!validRecordId(id) || !VALID_STATUS.includes(status as (typeof VALID_STATUS)[number])) return

  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
    if (error) throw error
  } catch (err) {
    console.error('[updateStatus]', err)
    redirect('/admin/candidature?error=save_failed')
  }

  revalidatePath('/admin/candidature')
  revalidatePath('/admin')
}
