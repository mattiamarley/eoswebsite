import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'
import { toggleFavorite, updateStatus } from './actions'
import { validRecordId } from '@/src/lib/security'

const statuses=[['nuova','Nuova'],['letta','Letta'],['in_valutazione','In valutazione']] as const
const tabs=[['tutte','Tutte'],['nuove','Nuove'],['preferite','Preferite']] as const
const inputClass='w-full rounded-xl border border-white/60 bg-white/70 p-3 text-sm text-ink'
type Application={id:string;job_id:string|null;applicant_name:string;email:string;phone:string|null;message:string|null;job_title:string|null;documents:string[]|null;status:string;is_favorite:boolean;created_at:string;privacy_accepted_at:string|null;jobs:{title:string}|null}
export default async function CandidaturePage({searchParams}:{searchParams:Promise<{tab?:string;q?:string;job?:string;page?:string;error?:string}>}) {
  const {supabase}=await requireAdmin()
  const params=await searchParams
  const tab=tabs.some(([key])=>key===params.tab)?params.tab!:'tutte'
  const q=(params.q??'').trim().slice(0,120)
  const job=validRecordId(params.job)?params.job:''
  const page=Math.min(10000,Math.max(1,Number.parseInt(params.page??'1',10)||1))
  const href=(changes:Record<string,string>)=>{const next=new URLSearchParams({tab,q,job,...changes});return `/admin/candidature?${next}`}
  let query=supabase.from('applications').select('id,job_id,applicant_name,email,phone,message,job_title,documents,status,is_favorite,created_at,privacy_accepted_at,jobs(title)',{count:'exact'}).order('created_at',{ascending:false}).order('id')
  if(tab==='nuove')query=query.eq('status','nuova')
  if(tab==='preferite')query=query.eq('is_favorite',true)
  if(job)query=query.eq('job_id',job)
  if(q){const safe=q.replace(/[^\p{L}\p{N}@.\s+-]/gu,' ').trim();if(safe)query=query.or(`applicant_name.ilike.%${safe}%,email.ilike.%${safe}%`)}
  const [{data,error,count},{data:jobs,error:jobsError}]=await Promise.all([query.range((page-1)*25,page*25-1),supabase.from('jobs').select('id,title,is_open').order('title')])
  const applications=(data??[]) as unknown as Application[]
  const groups=new Map<string,{title:string;items:Application[]}>()
  for(const app of applications){const key=app.job_id??app.job_title??'deleted';if(!groups.has(key))groups.set(key,{title:app.job_title||app.jobs?.title||'Posizione non più presente',items:[]});groups.get(key)!.items.push(app)}
  return <div className="min-h-screen">
    <header className="glass border-b border-white/50 sticky top-0 z-10"><nav className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2 text-sm" aria-label="Percorso"><Link href="/admin">Dashboard</Link><span>/ Candidature</span></nav></header>
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-ink">Hub candidature</h1><p className="text-sm text-muted mt-2 mb-6">Contatti, curriculum e presentazione, raccolti per ogni posizione aperta.</p>
      {params.error&&<p role="alert" className="rounded-xl p-4 mb-5 bg-red-50 text-red-700">Modifica non salvata. Ricarica e riprova.</p>}
      <nav className="flex flex-wrap gap-2 mb-5" aria-label="Viste candidature">{tabs.map(([key,label])=><Link key={key} href={href({tab:key,page:'1'})} aria-current={tab===key?'page':undefined} className={`rounded-full px-5 py-2 text-sm border ${tab===key?'bg-ink text-white':'glass text-ink'}`}>{label}</Link>)}</nav>
      <form className="glass rounded-card p-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] mb-7" action="/admin/candidature"><input type="hidden" name="tab" value={tab}/><label className="text-sm text-ink">Cerca candidato<input className={inputClass} name="q" defaultValue={q} placeholder="Nome, cognome o email" maxLength={120}/></label><label className="text-sm text-ink">Posizione<select className={inputClass} name="job" defaultValue={job}><option value="">Tutte le posizioni</option>{jobs?.map(position=><option key={position.id} value={position.id}>{position.title}{position.is_open?'':' · Chiusa'}</option>)}</select></label><button className="team-order-save self-end" type="submit">Filtra</button></form>
      {jobsError&&<p role="status" className="text-red-700 mb-4">Filtro posizioni temporaneamente non disponibile.</p>}
      {error?<div role="alert" className="glass rounded-card p-6 text-red-700">Impossibile caricare le candidature. Verifica la connessione e la migrazione candidature su Supabase.</div>:<>
        <p className="text-sm text-muted mb-5">{count??0} candidature trovate · pagina {page}</p>
        {!applications.length&&<div className="glass rounded-card p-8 text-center text-muted">Nessuna candidatura in questa vista.</div>}
        {[...groups].map(([key,group])=><section key={key} className="mb-8"><h2 className="font-bold text-lg text-ink mb-4">{group.title}</h2><ul className="space-y-4">{group.items.map(app=><li key={app.id} className="glass rounded-card shadow-soft p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h3 className="font-bold text-lg text-ink break-words">{app.applicant_name}</h3><p className="text-xs text-muted mt-1">{new Date(app.created_at).toLocaleString('it-IT',{timeZone:'Europe/Rome'})} · {statuses.find(([key])=>key===app.status)?.[1]??app.status}</p><div className="flex flex-wrap gap-4 mt-3 text-sm break-all"><a href={`mailto:${app.email}`}>{app.email}</a>{app.phone&&<a href={`tel:${app.phone.replace(/[^+\d]/g,'')}`}>{app.phone}</a>}</div></div>
          <form action={toggleFavorite}><input type="hidden" name="id" value={app.id}/><input type="hidden" name="current" value={String(app.is_favorite)}/><button type="submit" aria-pressed={app.is_favorite} className="rounded-full border px-4 py-2 text-sm">{app.is_favorite?'★ Preferita':'☆ Preferita'}</button></form></div>
          {app.message&&<div className="mt-5 text-sm text-ink"><h4 className="font-semibold mb-2">Presentazione</h4><p className="whitespace-pre-wrap break-words">{app.message}</p></div>}
          <div className="flex flex-wrap gap-3 mt-5">{app.documents?.length?app.documents.map((_,index)=><a key={index} href={`/admin/candidature/${app.id}/documento/${index}`} target="_blank" rel="noopener noreferrer" className="team-order-save">{index===0?'Scarica curriculum':'Scarica portfolio'}</a>):<p className="text-sm text-muted">Nessun documento allegato.</p>}</div>
          <form action={updateStatus} className="flex flex-wrap items-center gap-2 mt-5"><input type="hidden" name="id" value={app.id}/><label className="text-sm" htmlFor={`status-${app.id}`}>Stato</label><select className="rounded-xl border p-2 text-sm" id={`status-${app.id}`} name="status" defaultValue={app.status}>{statuses.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select><button type="submit" className="rounded-full border px-4 py-2 text-sm">Salva stato</button></form>
          <p className="text-xs text-muted mt-4">{app.privacy_accepted_at?`Informativa letta il ${new Date(app.privacy_accepted_at).toLocaleDateString('it-IT')}`:'Candidatura precedente: presa visione non registrata.'}</p>
        </li>)}</ul></section>)}
        <nav className="flex justify-center gap-6 text-sm" aria-label="Pagine candidature">{page>1&&<Link href={href({page:String(page-1)})}>← Precedente</Link>}{page*25<(count??0)&&<Link href={href({page:String(page+1)})}>Successiva →</Link>}</nav>
      </>}
    </main>
  </div>
}
