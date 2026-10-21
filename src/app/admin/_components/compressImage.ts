const MAX_DIMENSION = 1920 // lato massimo (px): più che sufficiente per il web
const QUALITY = 0.8

/**
 * Ridimensiona e ricomprime un'immagine nel browser tramite Canvas.
 * Se qualcosa va storto (o il file non è un'immagine) restituisce l'originale.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY)
    )
    if (!blob || blob.size >= file.size) return file // se non aiuta, teniamo l'originale

    const name = file.name.replace(/\.[^./\\]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
