import { validRecordId } from './security.ts'
import { publicImagePath } from './image-security.ts'
export const ABOUT_GALLERY_MAX=8
export type GallerySlide={id:string;src:string;alt:string}
export type AboutGallery={slides:GallerySlide[]|null;revision:number}
export type GallerySaveResult={success:boolean;message:string;gallery?:AboutGallery}
export function galleryDraft(value:unknown):GallerySlide[]|null {
  if(!Array.isArray(value)||value.length>ABOUT_GALLERY_MAX)return null
  const seen=new Set<string>()
  const result:GallerySlide[]=[]
  for(const raw of value){
    if(!raw||typeof raw!=='object'||!validRecordId(raw.id)||seen.has(raw.id)||typeof raw.src!=='string'||raw.src.length>2048||typeof raw.alt!=='string'||!raw.alt.trim()||raw.alt.length>160||/[\x00-\x1f]/.test(raw.alt))return null
    seen.add(raw.id);result.push({id:raw.id,src:raw.src,alt:raw.alt.trim()})
  }
  return result
}
export function validGalleryImage(src:string,origin:string|undefined):boolean {
  const path=publicImagePath(src,origin)
  return path!==null&&/^about\/[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(path)
}
export function retainedGallerySlide(slide:GallerySlide,current:GallerySlide[],origin:string|undefined):boolean {
  return validGalleryImage(slide.src,origin)&&current.some(item=>item.id===slide.id&&item.src===slide.src)
}
export function galleryUploadError(files:{size:number}[]):string|null {
  if(files.some(file=>file.size>3*1024*1024))return 'Ogni nuova foto può pesare al massimo 3 MB dopo l’ottimizzazione.'
  if(files.reduce((sum,file)=>sum+file.size,0)>4*1024*1024)return 'Le nuove foto superano 4 MB complessivi. Aggiungine meno e salva, poi carica le successive.'
  return null
}
