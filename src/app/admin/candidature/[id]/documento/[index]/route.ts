import { requireAdmin } from '@/src/utils/supabase/admin'
import { validRecordId } from '@/src/lib/security'
import { applicationDocumentPath } from '@/src/lib/application-input'

export async function GET(_request:Request,{params}:{params:Promise<{id:string;index:string}>}) {
  const {supabase}=await requireAdmin()
  const {id,index}=await params
  const failure=(status:number)=>new Response('Documento non disponibile. Torna alle candidature e riprova.',{status,headers:{'Cache-Control':'private, no-store'}})
  if(!validRecordId(id)||! /^[01]$/.test(index))return failure(404)
  const {data,error}=await supabase.from('applications').select('documents').eq('id',id).single()
  const path=data?.documents?.[Number(index)]
  if(error||typeof path!=='string'||!applicationDocumentPath(path,id))return failure(404)
  const {data:signed,error:signError}=await supabase.storage.from('applications-docs').createSignedUrl(path,60,{download:Number(index)===0?'Curriculum.pdf':'Portfolio.pdf'})
  if(signError||!signed)return failure(503)
  return new Response(null,{status:302,headers:{Location:signed.signedUrl,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}})
}
