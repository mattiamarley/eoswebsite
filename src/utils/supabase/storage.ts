import type { createClient } from './server'
import { matchesImageSignature, publicImagePath } from '@/src/lib/image-security'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export const STORAGE_BUCKET = 'website-images'

/**
 * Carica un file nel bucket pubblico e restituisce la sua URL pubblica.
 * Lancia un errore in caso di fallimento: va richiamata dentro un try/catch.
 */
export async function uploadImage(
  supabase: SupabaseServerClient,
  file: File
): Promise<string> {
  const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
  const ext = file instanceof File ? extensions[file.type] : undefined
  if (!(file instanceof File) || !ext || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error('Sono consentite immagini JPEG, PNG o WebP fino a 5 MB.')
  if (!matchesImageSignature(new Uint8Array(await file.slice(0,12).arrayBuffer()),file.type)) throw new Error('Il contenuto del file non corrisponde al formato immagine.')
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Estrae il path interno al bucket da una public URL di Supabase Storage. */
function pathFromPublicUrl(url: string): string | null {
  return publicImagePath(url, process.env.NEXT_PUBLIC_SUPABASE_URL)
}

/**
 * Rimuove dallo Storage i file corrispondenti alle public URL passate.
 * Ignora le URL che non appartengono al bucket. Lancia errore in caso di
 * fallimento: va richiamata dentro un try/catch.
 */
export async function deleteImages(
  supabase: SupabaseServerClient,
  urls: string[]
): Promise<void> {
  const paths = urls
    .map(pathFromPublicUrl)
    .filter((path): path is string => path !== null)
  if (paths.length === 0) return

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths)
  if (error) throw error
}
