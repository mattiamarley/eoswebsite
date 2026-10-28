import { createClient } from '@/src/utils/supabase/server'
import { publicImagePath } from '@/src/lib/image-security'
import { galleryDraft,validGalleryImage,type GalleryKey } from '@/src/lib/about-gallery'
import { PhotoShowcase,type ShowcaseImage } from './PhotoShowcase'
export function AboutGallery(){return <SiteGallery galleryKey="about"/>}
export async function SiteGallery({galleryKey}:{galleryKey:GalleryKey}){
  let dedicated:ShowcaseImage[]|undefined
  let images:ShowcaseImage[]=[]
  try {
    const client=await createClient()
    const {data,error}=await client.from('site_galleries').select('slides').eq('key',galleryKey).abortSignal(AbortSignal.timeout(3000)).maybeSingle()
    if(!error&&data?.slides!==null&&data?.slides!==undefined){
      const slides=galleryDraft(data.slides)
      if(slides)dedicated=slides.filter(slide=>validGalleryImage(slide.src,process.env.NEXT_PUBLIC_SUPABASE_URL,galleryKey))
    }
  }catch{}
  if(dedicated!==undefined)return dedicated.length?<PhotoShowcase label={galleryKey==='studio'?'Fotografie dell’ufficio EOS':'Immagini dei progetti'} key={JSON.stringify(dedicated)} images={dedicated}/>:null

  if(galleryKey==='studio')return <PhotoShowcase label="Fotografie dell’ufficio EOS" images={[{src:'/images/studio-reference.webp',alt:'Professionisti riuniti attorno a un tavolo di lavoro',title:'EOS Ufficio.',description:'La squadra. Competenze diverse, una direzione condivisa.'}]}/>
  try {const client=await createClient();const {data,error}=await client.from('projects').select('title,images,description').order('created_at',{ascending:false}).limit(8).abortSignal(AbortSignal.timeout(3000));if(!error) images=(data??[]).flatMap(row=>(Array.isArray(row.images)?row.images:[]).filter((url):url is string=>typeof url==='string'&&publicImagePath(url,process.env.NEXT_PUBLIC_SUPABASE_URL)!==null).map(src=>({src,alt:row.title,title:row.title,description:row.description??undefined}))).slice(0,8)}catch{}
  if(!images.length)images=[0,1,2].map(index=>({src:`/images/featured-stock-${index}.jpg`,alt:'Fotografia illustrativa di architettura'}))
  return <PhotoShowcase images={images}/>
}
