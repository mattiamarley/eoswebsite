import { AdminHeader } from '@/src/app/admin/_components/AdminHeader'
import { getProjectSchema } from '@/src/utils/supabase/project-schema'
import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { addProject, updateProject, deleteProject } from './actions'
import { SearchBox } from '../../_components/SearchBox'
import { Modal } from '../../_components/Modal'
import { ProjectFields } from './ProjectFields'

type Project = {
  id: string
  title: string
  description: string | null
  images: string[] | null
  is_featured: boolean
  tags: string[] | null
  created_at: string
}

type Props = {
  searchParams: Promise<{ error?: string; edit?: string; q?: string }>
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: 'Dati non validi o troppo lunghi. Controlla i campi e riprova.',
  missing_title: 'Il titolo è obbligatorio.',
  insert_failed: 'Errore durante l\'inserimento. Riprova.',
  update_failed: 'Errore durante la modifica. Riprova.',
  delete_failed: 'Errore durante l\'eliminazione. Riprova.',
}

export default async function ProgettiPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()

  const { error: errorParam, edit: editId, q: qParam } = await searchParams
  const q = (qParam ?? '').trim()

  let projects:Project[]=[]
  let loadError=false
  let schema={tags:false,is_featured:false}
  try {
    schema=await getProjectSchema(supabase)
    const columns=['id','title','description','images','created_at',...(schema.tags?['tags']:[]),...(schema.is_featured?['is_featured']:[])].join(',')
    let query=supabase.from('projects').select(columns)
    if(q){const safe=q.replace(/[,()%]/g,' ').trim();query=query.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)}
    const {data,error}=await query.order('created_at',{ascending:false}).abortSignal(AbortSignal.timeout(5000))
    if(error)throw error
    projects=(data??[]) as unknown as Project[]
  } catch {loadError=true}

  const editing = editId ? projects?.find((p) => p.id === editId) ?? null : null

  return (
    <div className="min-h-screen">
      <AdminHeader backHref="/admin/contenuti"><Link href="/admin" className="text-muted hover:text-ink transition">Dashboard</Link>
          <span aria-hidden="true" className="text-muted">/</span>
          <Link href="/admin/contenuti" className="text-muted hover:text-ink transition">Contenuti</Link>
          <span aria-hidden="true" className="text-muted">/</span>
          <span className="font-semibold text-ink">Progetti</span></AdminHeader>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {loadError && <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">I progetti non sono raggiungibili in questo momento. I dati esistenti non sono stati modificati. Ricarica la pagina dopo aver verificato che Supabase sia attivo.</p>}
        {!loadError&&(!schema.tags||!schema.is_featured)&&<p role="status" className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">Puoi gestire titoli, descrizioni e fotografie. Per attivare {(!schema.tags&&!schema.is_featured)?'etichette e selezione in evidenza':!schema.tags?'le etichette':'la selezione in evidenza'} è necessario completare l’aggiornamento del database.</p>}
        {errorParam && ERROR_MESSAGES[errorParam] && (
          <div className="mb-6 px-4 py-3 rounded-panel bg-red-50 border border-red-200 text-sm text-red-700">
            {ERROR_MESSAGES[errorParam]}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          <div className="glass rounded-card shadow-soft p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-ink mb-5">Nuovo progetto</h2>
            <form action={addProject} className="space-y-4">
              <fieldset disabled={!!loadError}><ProjectFields schema={schema}/></fieldset>
              <button
                type="submit"
                disabled={!!loadError}
                className="w-full py-2.5 bg-lavender text-ink text-sm font-semibold rounded-full shadow-soft transition hover:bg-lavender-dark hover:text-white active:scale-[0.98]"
              >
                Aggiungi progetto
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink">Progetti</h2>
              <span className="text-sm text-muted">{loadError?'—':projects.length} totali</span>
            </div>
            <div className="mb-4">
              <SearchBox action="/admin/contenuti/progetti" defaultValue={q} placeholder="Cerca per titolo o descrizione…" />
            </div>

            {!projects || projects.length === 0 ? (
              <div className="glass rounded-card shadow-soft px-6 py-12 text-center">
                <p className="text-sm text-muted">
                  {loadError?'Elenco temporaneamente non disponibile.':q ? `Nessun risultato per «${q}».` : 'Nessun progetto ancora. Aggiungine uno con il form.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {projects.map((project: Project) => (
                  <li
                    key={project.id}
                    className={`glass rounded-card shadow-soft transition hover:shadow-lift ${
                      editing?.id === project.id ? 'ring-2 ring-lavender' : schema.is_featured && project.is_featured ? 'ring-1 ring-lavender/70' : ''
                    }`}
                  >
                    <div className="px-6 py-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-ink">{project.title}</p>
                          {schema.is_featured && project.is_featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white"><span aria-hidden="true" className="text-lavender-light">★</span>In evidenza</span>}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">{project.tags?.map(tag=><span key={tag} className="rounded-full bg-lavender/30 px-2 py-1 text-xs text-ink">{tag}</span>)}</div>
                        {project.description && (
                          <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted">
                          {new Date(project.created_at).toLocaleDateString('it-IT', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <Link
                          href={`/admin/contenuti/progetti?edit=${project.id}`}
                          className="text-sm font-semibold text-lavender-dark border border-lavender/40 px-4 py-1.5 rounded-full transition hover:bg-lavender-light"
                        >
                          Modifica
                        </Link>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="text-sm font-medium text-red-500 border border-red-200 px-4 py-1.5 rounded-full transition hover:bg-red-50"
                          >
                            Elimina
                          </button>
                        </form>
                      </div>
                    </div>

                    {project.images && project.images.length > 0 && (
                      <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {project.images.slice(0, 6).map((url, i) => {
                          const isLast = i === 5 && project.images!.length > 6
                          return (
                            <div key={i} className="relative aspect-[4/3] rounded-panel overflow-hidden border border-white/40 shadow-soft bg-mist">
                              <Image
                                src={url}
                                alt={`${project.title} — immagine ${i + 1}`}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 50vw, 220px"
                                className="object-cover"
                              />
                              {isLast && (
                                <div className="absolute inset-0 bg-ink-deep/60 flex items-center justify-center text-white text-base font-bold">
                                  +{project.images!.length - 6}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {editing && (
        <Modal title="Modifica progetto" closeHref="/admin/contenuti/progetti">
          <form action={updateProject} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <ProjectFields values={editing} schema={schema}/>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/admin/contenuti/progetti"
                className="flex-1 py-2.5 text-center text-sm font-medium text-muted border border-haze rounded-full transition hover:bg-mist"
              >
                Annulla
              </Link>
              <button
                type="submit"
                disabled={!!loadError}
                className="flex-1 py-2.5 bg-lavender text-ink text-sm font-semibold rounded-full shadow-soft transition hover:bg-lavender-dark hover:text-white active:scale-[0.98]"
              >
                Salva modifiche
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
