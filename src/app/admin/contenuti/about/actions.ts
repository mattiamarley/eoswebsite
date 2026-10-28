'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/src/utils/supabase/admin'
import { uploadImage,deleteImages } from '@/src/utils/supabase/storage'
import { galleryDraft,galleryCaptionError,galleryUploadError,retainedGallerySlide,validGalleryImage,type GallerySlide,type GalleryKey,type GallerySaveResult } from '@/src/lib/about-gallery'

export async function saveAboutGallery(form:FormData,galleryKey:GalleryKey='about'):Promise<GallerySaveResult>{
  const {supabase}=await requireAdmin()
  const fail=(message:string):GallerySaveResult=>({success:false,message})
  if(galleryKey!=='about'&&galleryKey!=='studio')return fail('Sezione non valida.')
  const label=galleryKey==='studio'?'Ufficio':'About'
  const raw=form.get('slides'),revisionValue=form.get('revision')
  if(typeof raw!=='string'||raw.length>48000||typeof revisionValue!=='string'||!/^\d{1,9}$/.test(revisionValue))return fail('Dati non validi. Ricarica la pagina.')
  let slides:GallerySlide[]|null
  try{slides=galleryDraft(JSON.parse(raw))}catch{return fail('Selezione non valida.')}
  if(!slides)return fail('Controlla le foto e i testi: massimo 8 foto e testo alternativo di 160 caratteri.')
  const captionError=galleryCaptionError(slides)
  if(captionError)return fail(captionError)
  const {data:current,error:readError}=await supabase.from('site_galleries').select('slides,revision').eq('key',galleryKey).single()
  if(readError||!current)return fail('Impossibile leggere il carosello. Verifica la migrazione Supabase.')
  const revision=Number(revisionValue)
  if(current.revision!==revision)return fail('Il carosello è stato modificato da un altro amministratore. Ricarica prima di salvare.')
  const previous=current.slides===null?[]:galleryDraft(current.slides)
  if(!previous)return fail('Configurazione precedente non valida. Contatta chi gestisce il sito.')
  const files:File[]=[]
  for(const slide of slides){
    if(slide.src){if(!retainedGallerySlide(slide,previous,process.env.NEXT_PUBLIC_SUPABASE_URL,galleryKey))return fail('Una foto non appartiene a questo carosello.')}
    else {
      const file=form.get(`image:${slide.id}`)
      if(previous.some(item=>item.id===slide.id)||!(file instanceof File)||!file.size)return fail('Una nuova foto non è disponibile. Riseleziona il file.')
      files.push(file)
    }
  }
  const sizeError=galleryUploadError(files)
  if(sizeError)return fail(sizeError)
  const uploaded:string[]=[]
  const resolved:GallerySlide[]=[]
  try{
    for(const slide of slides){
      const src=slide.src||await uploadImage(supabase,form.get(`image:${slide.id}`) as File,galleryKey)
      if(!slide.src)uploaded.push(src)
      resolved.push({...slide,src})
    }
    const {data:saved,error}=await supabase.from('site_galleries').update({slides:resolved,revision:revision+1}).eq('key',galleryKey).eq('revision',revision).select('revision').maybeSingle()
    if(error||!saved)throw new Error('save_failed')
  }catch{
    if(uploaded.length)await deleteImages(supabase,uploaded).catch(()=>console.error('[aboutGallery] upload cleanup failed'))
    return fail('Salvataggio non riuscito. Le modifiche restano qui: riprova oppure ricarica se un altro amministratore ha aggiornato il carosello.')
  }
  const removed=previous.filter(slide=>!resolved.some(item=>item.src===slide.src)&&validGalleryImage(slide.src,process.env.NEXT_PUBLIC_SUPABASE_URL,galleryKey)).map(slide=>slide.src)
  // Only delete gallery-owned objects, never images belonging to portfolio or team.
  if(removed.length)await deleteImages(supabase,removed).catch(()=>console.error('[aboutGallery] removed-image cleanup failed'))
  revalidatePath('/admin/contenuti/caroselli');revalidatePath(`/${galleryKey}`);revalidatePath(`/admin/contenuti/${galleryKey}`)
  return {success:true,message:resolved.length?`Carosello salvato. La pagina ${label} è aggiornata.`:`Carosello nascosto dalla pagina ${label}.`,gallery:{slides:resolved,revision:revision+1}}
}
