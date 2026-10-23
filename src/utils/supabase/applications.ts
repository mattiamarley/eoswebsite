import type { createClient } from './server'
import { missingApplicationType } from '../../lib/application-schema.ts'

type Options={tab:string;job:string;q:string;page:number}
export async function loadApplications(client:Awaited<ReturnType<typeof createClient>>,options:Options){
  const {tab,job,q,page}=options
  function query(includeType:boolean){
    const columns=['id','job_id','applicant_name','email','phone','message','job_title','documents','status','is_favorite','created_at','privacy_accepted_at','jobs(title)',...(includeType?['application_type']:[])].join(',')
    let request=client.from('applications').select(columns,{count:'exact'}).order('created_at',{ascending:false}).order('id')
    if(tab==='nuove')request=request.eq('status','nuova')
    if(tab==='preferite')request=request.eq('is_favorite',true)
    if(job==='spontaneous')request=request.eq('application_type','spontaneous')
    else if(job)request=request.eq('job_id',job)
    if(q){const safe=q.replace(/[^\p{L}\p{N}@.\s+-]/gu,' ').trim();if(safe)request=request.or(`applicant_name.ilike.%${safe}%,email.ilike.%${safe}%`)}
    return request.range((page-1)*25,page*25-1).abortSignal(AbortSignal.timeout(8000))
  }
  const result=await query(true)
  if(!missingApplicationType(result.error))return {...result,legacy:false,unsupportedFilter:false}
  // A missing optional field must not hide existing candidates or fabricate an empty filtered result.
  if(job==='spontaneous')return {...result,legacy:true,unsupportedFilter:true}
  const fallback=await query(false)
  return {...fallback,legacy:true,unsupportedFilter:false}
}
