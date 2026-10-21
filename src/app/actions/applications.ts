'use server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { revalidatePath } from 'next/cache'

type State={success:boolean;message:string}
export async function submitApplication(_previous:State,form:FormData):Promise<State> {
  const fail=(message:string):State=>({success:false,message})
  // Intake remains closed until the privacy notice and private storage migration are verified.
  if(process.env.APPLICATIONS_ENABLED!=='true'||!process.env.SUPABASE_SERVICE_ROLE_KEY) return fail('L’invio dal sito non è ancora attivo. Puoi contattarci a eos@eosweb.it.')
  if(form.get('website')) return fail('Impossibile inviare la candidatura.')
  const name=String(form.get('name')??'').trim(),email=String(form.get('email')??'').trim().toLowerCase(),phone=String(form.get('phone')??'').trim(),job=String(form.get('job_id')??'')
  if(name.length<2||name.length>120||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>30||form.get('privacy')!=='on'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(job)) return fail('Verifica i campi e la presa visione dell’informativa privacy.')
  const files=form.getAll('documents').filter((f):f is File=>f instanceof File && f.size>0)
  if(!files.length||files.length>2||files.some(f=>f.type!=='application/pdf'||f.size>3*1024*1024)) return fail('Allega uno o due PDF, massimo 3 MB ciascuno.')
  for(const f of files) if(Buffer.from(await f.slice(0,5).arrayBuffer()).toString()!=='%PDF-') return fail('Uno degli allegati non è un PDF valido.')
  const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}})
  const uploaded:string[]=[]
  try {
    const {data:position,error:jobError}=await client.from('jobs').select('id').eq('id',job).eq('is_open',true).maybeSingle()
    if(jobError||!position) return fail('Questa posizione non è più disponibile.')
    // Atomic database throttle works across server instances. Requires the supplied migration.
    const {data:allowed,error:limitError}=await client.rpc('allow_application_submission',{email_hash:createHash('sha256').update(email).digest('hex')})
    if(limitError||!allowed) return fail('Non è possibile inviare ora. Riprova più tardi o scrivi a eos@eosweb.it.')
    const id=crypto.randomUUID()
    for(const f of files) {
      const path=`${id}/${crypto.randomUUID()}.pdf`
      const {error}=await client.storage.from('applications-docs').upload(path,f,{contentType:'application/pdf',upsert:false})
      if(error) throw error
      uploaded.push(path)
    }
    const {error}=await client.from('applications').insert({id,job_id:job,applicant_name:name,email,phone:phone||null,documents:uploaded,status:'nuova'})
    if(error) throw error
    revalidatePath('/admin/candidature');revalidatePath('/admin')
    return {success:true,message:'Grazie per averci scritto. Il team esaminerà il tuo profilo.'}
  } catch {
    if(uploaded.length) await client.storage.from('applications-docs').remove(uploaded)
    return fail('Invio non riuscito. Riprova più tardi o contattaci a eos@eosweb.it.')
  }
}
