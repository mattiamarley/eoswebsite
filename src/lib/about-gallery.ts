import { validRecordId } from './security.ts'
import { publicImagePath } from './image-security.ts'
export type GalleryKey='about'|'studio'
export const ABOUT_GALLERY_MAX=8
export type GallerySlide={id:string;src:string;alt:string;title?:string;description?:string}
export type AboutGallery={slides:GallerySlide[]|null;revision:number}
export type GallerySaveResult={success:boolean;message:string;gallery?:AboutGallery}
export function galleryDraft(value:unknown):GallerySlide[]|null {
  if(!Array.isArray(value)||value.length>ABOUT_GALLERY_MAX)return null
  const seen=new Set<string>()
  const result:GallerySlide[]=[]
  for(const raw of value){
    if(!raw||typeof raw!=='object'||!validRecordId(raw.id)||seen.has(raw.id)||typeof raw.src!=='string'||raw.src.length>2048||typeof raw.alt!=='string'||!raw.alt.trim()||raw.alt.length>160||/[\x00-\x1f]/.test(raw.alt))return null
    const title=raw.title===undefined?'':raw.title, description=raw.description===undefined?'':raw.description
    if(typeof title!=='string'||title.length>120||/[\x00-\x1f]/.test(title)||typeof description!=='string'||description.length>600||description.includes('\0'))return null
    seen.add(raw.id);result.push({id:raw.id,src:raw.src,alt:raw.alt.trim(),title:title.trim(),description:description.trim()})
  }
  return result
}
export function validGalleryImage(src:string,origin:string|undefined,galleryKey:GalleryKey='about'):boolean {
  const path=publicImagePath(src,origin)
  if(!path)return false
  const [folder,file,...extra]=path.split('/')
  return folder===galleryKey&&extra.length===0&&!!file&&/\.(jpg|png|webp)$/.test(file)&&validRecordId(file.replace(/\.(jpg|png|webp)$/,''))
}
export function retainedGallerySlide(slide:GallerySlide,current:GallerySlide[],origin:string|undefined,galleryKey:GalleryKey='about'):boolean {
  return validGalleryImage(slide.src,origin,galleryKey)&&current.some(item=>item.id===slide.id&&item.src===slide.src)
}
export function galleryUploadError(files:{size:number}[]):string|null {
  if(files.some(file=>file.size>3*1024*1024))return 'Ogni nuova foto può pesare al massimo 3 MB dopo l’ottimizzazione.'
  if(files.reduce((sum,file)=>sum+file.size,0)>4*1024*1024)return 'Le nuove foto superano 4 MB complessivi. Aggiungine meno e salva, poi carica le successive.'
  return null
}
