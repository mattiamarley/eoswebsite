'use server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { applicationSizeError } from '@/src/lib/application-limits'
import { applicationInput } from '@/src/lib/application-input'

type State={success:boolean;message:string}
export async function submitApplication(_previous:State,form:FormData):Promise<State> {
  const fail=(message:string):State=>({success:false,message})
  // Intake remains closed until the privacy notice and private storage migration are verified.
  if(process.env.APPLICATIONS_ENABLED!=='true'||!process.env.SUPABASE_SERVICE_ROLE_KEY) return fail('L’invio dal sito non è ancora attivo. Puoi contattarci a eos@eosweb.it.')
  if(form.get('website')) return fail('Impossibile inviare la candidatura.')
  const input=applicationInput(form)
  if(!input)return fail('Completa nome, cognome, email e presa visione dell’informativa. Controlla la lunghezza dei campi.')
  const {email,job_id:job}=input
  const files=[form.get('cv'),form.get('portfolio')].filter((f):f is File=>f instanceof File && f.size>0)
  if(!(form.get('cv') instanceof File)||!(form.get('cv') as File).size||!files.length||files.length>2||files.some(f=>f.type!=='application/pdf'||f.size>3*1024*1024)) return fail('Allega il curriculum in PDF (obbligatorio) e, se vuoi, un portfolio: massimo 3 MB ciascuno.')
  const sizeError=applicationSizeError(files)
  if(sizeError)return fail(sizeError)
  for(const f of files) if(Buffer.from(await f.slice(0,5).arrayBuffer()).toString()!=='%PDF-') return fail('Uno degli allegati non è un PDF valido.')
  const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  const uploaded:string[]=[]
  try {
    let jobTitle='Candidatura spontanea'
    if(job){
      const {data:position,error:jobError}=await client.from('jobs').select('id,title').eq('id',job).eq('is_open',true).maybeSingle()
      if(jobError||!position) return fail('Questa posizione non è più disponibile.')
      jobTitle=position.title
    }
    // Atomic database throttle works across server instances. Requires the supplied migration.
    const {data:allowed,error:limitError}=await client.rpc('allow_application_submission',{email_hash:createHash('sha256').update(email).digest('hex')})
    if(limitError||!allowed) return fail('Non è possibile inviare ora. Riprova più tardi.')
    const id=crypto.randomUUID()
    for(const f of files) {
      const path=`${id}/${crypto.randomUUID()}.pdf`
      const {error}=await client.storage.from('applications-docs').upload(path,f,{contentType:'application/pdf',upsert:false})
      if(error) throw error
      uploaded.push(path)
    }
    const {error}=await client.from('applications').insert({id,...input,job_title:jobTitle,documents:uploaded,status:'nuova',privacy_accepted_at:new Date().toISOString(),privacy_version:'recruitment-v1'})
    if(error) throw error
    revalidatePath('/admin/candidature');revalidatePath('/admin')
    return {success:true,message:'Grazie per averci scritto. Il team esaminerà il tuo profilo.'}
  } catch {
    if(uploaded.length) await client.storage.from('applications-docs').remove(uploaded).catch(()=>console.error('[applications] cleanup failed'))
    return fail('Invio non riuscito. Riprova più tardi.')
  }
}
