import { publicImagePath } from '@/src/lib/image-security'
import { FeaturedProjects } from './FeaturedProjects'
import { PortfolioLayout, SamplePortfolio } from './PortfolioLayout'
import { ArrowIcon } from '@/src/components/site/ArrowIcon'
import { createClient } from '@/src/utils/supabase/server'
import { Cards } from './Cards'
export type PublicCard = {id:string;title:string;category:string;subtitle:string;description?:string;variant:number;images?:string[];tags?:string[];is_featured?:boolean}
export async function ContentCards({kind,limit,portfolioPage=false,featured=false}: {featured?:boolean;portfolioPage?:boolean;kind:'projects'|'team'|'jobs';limit?:number}) {
  let items:PublicCard[] = []
  let failed = false
  try {
    const client = await createClient()
    const table = kind==='team'?'team_members':kind
    let columns:string = kind==='team'?'id,full_name,job_tag,image_url,description':kind==='jobs'?'id,title,category,location,description':'id,title,images,tags,is_featured,description'
    let query = client.from(table).select(columns).order('created_at',{ascending:false})
    if(kind==='jobs') query=query.eq('is_open',true)
    if(limit) query=query.limit(limit)
    const response = await query.abortSignal(AbortSignal.timeout(3000))
    let data:unknown[]|null=response.data
    let error=response.error
    // Preserve available metadata while either additive migration is pending.
    for(let attempt=0; kind==='projects' && error?.code==='42703' && attempt<2; attempt++) {
      const missing=['tags','is_featured'].find(column=>error!.message.includes(column) && columns.split(',').includes(column))
      if(!missing) break
      columns=columns.split(',').filter(column=>column!==missing).join(',')
      let legacy=client.from('projects').select(columns).order('created_at',{ascending:false})
      if(limit) legacy=legacy.limit(limit)
      const result=await legacy.abortSignal(AbortSignal.timeout(3000))
      data=result.data; error=result.error
    }
    if(error) failed=true
    else items=(data??[]).map((raw,index)=>{
      const row=raw as unknown as Record<string,unknown>
      const images = kind==='team'?[row.image_url]:Array.isArray(row.images)?row.images:[]
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL
      return {description:typeof row.description==='string'?row.description:undefined,is_featured:row.is_featured===true,id:String(row.id),title:String(row.full_name??row.title??'EOS'),category:String(row.job_tag??row.category??(kind==='projects'?'Progetto EOS':'Il team')),subtitle:String(row.location??''),variant:index%3,...(kind==='projects'?{tags:Array.isArray(row.tags)?row.tags.filter((tag):tag is string=>typeof tag==='string'):[]}:{}),images:images.filter((url):url is string=>typeof url==='string' && publicImagePath(url,origin)!==null)}
    })
  } catch { failed=true }
  if(featured && !failed) return <FeaturedProjects items={items} previewOnly/>
  if(featured && failed && process.env.NODE_ENV==='development') return <FeaturedProjects items={[]} previewOnly/>
  if(failed && kind==='projects' && process.env.NODE_ENV==='development') return portfolioPage?<SamplePortfolio/>:<Cards kind="projects" limit={limit} animateEntrance={!!limit}/>
  if(failed) return <div className="empty-state"><p>Contenuti temporaneamente non disponibili.</p><a className="pill-button" href="mailto:eos@eosweb.it">Contatta lo studio <ArrowIcon/></a></div>
  if(!items.length) return <div className="empty-state"><p>{kind==='jobs'?'Al momento non ci sono posizioni aperte.':kind==='team'?'Il team sarà presentato qui a breve.':'Il portfolio è in aggiornamento.'}</p></div>
  if(portfolioPage)return <PortfolioLayout items={items}/>
  return <Cards kind={kind} animateEntrance={!!limit} data={items} limit={limit} applicationsEnabled={process.env.APPLICATIONS_ENABLED==='true' && !!process.env.SUPABASE_SERVICE_ROLE_KEY}/>
}
