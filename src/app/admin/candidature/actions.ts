'use server'

import { requireAdmin } from '@/src/utils/supabase/admin'

import { revalidatePath } from 'next/cache'

const VALID_STATUS = ['nuova', 'letta', 'in_valutazione'] as const

export async function toggleFavorite(formData: FormData) {
  const { supabase } = await requireAdmin()

  const id = formData.get('id') as string
  const current = formData.get('current') === 'true'
  if (!id) return

  try {
    const { error } = await supabase
      .from('applications')
      .update({ is_favorite: !current })
      .eq('id', id)
    if (error) console.error('[toggleFavorite]', error)
  } catch (err) {
    console.error('[toggleFavorite]', err)
  }

  revalidatePath('/admin/candidature')
  revalidatePath('/admin')
}

export async function updateStatus(formData: FormData) {
  const { supabase } = await requireAdmin()

  const id = formData.get('id') as string
  const status = formData.get('status') as string
  if (!id || !VALID_STATUS.includes(status as (typeof VALID_STATUS)[number])) return

  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
    if (error) console.error('[updateStatus]', error)
  } catch (err) {
    console.error('[updateStatus]', err)
  }

  revalidatePath('/admin/candidature')
  revalidatePath('/admin')
}
