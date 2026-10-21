/** Reject mismatched content types before storing files on the public origin. */
export function matchesImageSignature(bytes: Uint8Array, mime: string): boolean {
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  if (mime === 'image/png') return [137,80,78,71,13,10,26,10].every((byte,i)=>bytes[i]===byte)
  if (mime === 'image/webp') return String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP'
  return false
}

export function publicImagePath(value: string, origin: string | undefined): string | null {
  if (!origin) return null
  try {
    const url = new URL(value)
    const prefix = '/storage/v1/object/public/website-images/'
    if (url.username || url.password || url.origin !== new URL(origin).origin || !url.pathname.startsWith(prefix) || url.search || url.hash) return null
    const path = decodeURIComponent(url.pathname.slice(prefix.length))
    if (!path || path.split('/').some(part=>!part || part==='.' || part==='..') || /[\\\x00-\x1f]/.test(path)) return null
    return path
  } catch { return null }
}
