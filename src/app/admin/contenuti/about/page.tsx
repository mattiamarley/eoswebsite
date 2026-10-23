import Link from 'next/link'
import { requireAdmin } from '@/src/utils/supabase/admin'
import { galleryDraft } from '@/src/lib/about-gallery'
import { AboutGalleryEditor } from './AboutGalleryEditor'
export default async function AboutGalleryPage(){
  const {supabase}=await requireAdmin()
  const {data,error}=await supabase.from('site_galleries').select('slides,revision').eq('key','about').single()
  const missing=error&&['42P01','PGRST205'].includes(error.code)
  const slides=data?.slides===null?null:galleryDraft(data?.slides)
  const valid=!!data&&!error&&(data.slides===null||slides!==null)
  return <div className="min-h-screen"><header className="glass border-b border-white/50 sticky top-0 z-10"><nav className="max-w-6xl mx-auto px-6 h-14 flex gap-2 items-center text-sm" aria-label="Percorso"><Link href="/admin">Dashboard</Link><span>/</span><Link href="/admin/contenuti">Contenuti</Link><span>/ Carosello About</span></nav></header>
    <main className="max-w-6xl mx-auto px-6 py-10"><div className="flex flex-wrap justify-between items-start gap-4 mb-8"><div><h1 className="text-2xl font-bold text-ink">Carosello About</h1><p className="text-sm text-muted mt-2">Le foto di questa sezione vengono gestite indipendentemente dai progetti.</p></div><Link href="/about" target="_blank" rel="noopener noreferrer" className="team-order-save">Apri About ↗</Link></div>
      {valid?<AboutGalleryEditor initial={{slides,revision:data.revision}}/>:<div role="alert" className="glass rounded-card p-6 text-sm text-ink">{missing?'Per attivare questa sezione, esegui la migrazione 20261023_about_gallery.sql nell’SQL Editor di Supabase.':'Impossibile caricare il carosello. Verifica la connessione e la migrazione Supabase, poi ricarica la pagina.'}</div>}
    </main>
  </div>
}
