import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'
import { addJob, updateJob, toggleJobStatus } from './actions'
import { SearchBox } from '../../_components/SearchBox'
import { Modal } from '../../_components/Modal'
import { JobStatusToggle } from '../../_components/JobStatusToggle'
import { JobFields } from './JobFields'

type Job = {
  id: string
  title: string
  category: string | null
  location: string | null
  description: string | null
  is_open: boolean | null
  created_at: string
}

type Props = {
  searchParams: Promise<{ error?: string; edit?: string; q?: string; stato?: string }>
}

const FILTERS = [
  { key: 'tutte', label: 'Tutte' },
  { key: 'aperte', label: 'Aperte' },
  { key: 'chiuse', label: 'Chiuse' },
] as const

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: 'Dati non validi o troppo lunghi. Controlla i campi e riprova.',
  missing_title: 'Il titolo è obbligatorio.',
  insert_failed: 'Errore durante l\'inserimento. Riprova.',
  update_failed: 'Errore durante la modifica. Riprova.',
  delete_failed: 'Errore durante l\'eliminazione. Riprova.',
}

export default async function LavoroPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()

  const { error: errorParam, edit: editId, q: qParam, stato: statoParam } = await searchParams
  const q = (qParam ?? '').trim()
  const stato = FILTERS.some((f) => f.key === statoParam) ? (statoParam as string) : 'tutte'

  let query = supabase
    .from('jobs')
    .select('id, title, category, location, description, is_open, created_at')
  if (q) {
    const safe = q.replace(/[,()%]/g, ' ').trim()
    query = query.or(
      `title.ilike.%${safe}%,category.ilike.%${safe}%,location.ilike.%${safe}%,description.ilike.%${safe}%`
    )
  }
  if (stato === 'aperte') query = query.eq('is_open', true)
  if (stato === 'chiuse') query = query.eq('is_open', false)
  const { data: jobs } = await query.order('created_at', { ascending: false })

  const editing = editId ? jobs?.find((j) => j.id === editId) ?? null : null

  const filterHref = (key: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (key !== 'tutte') params.set('stato', key)
    const qs = params.toString()
    return `/admin/contenuti/lavoro${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted hover:text-ink transition">Dashboard</Link>
          <span className="text-haze">/</span>
          <Link href="/admin/contenuti" className="text-muted hover:text-ink transition">Contenuti</Link>
          <span className="text-haze">/</span>
          <span className="font-semibold text-ink">Lavoro</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {errorParam && ERROR_MESSAGES[errorParam] && (
          <div className="mb-6 px-4 py-3 rounded-panel bg-red-50 border border-red-200 text-sm text-red-700">
            {ERROR_MESSAGES[errorParam]}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* Form inserimento */}
          <div className="glass rounded-card shadow-soft p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-ink mb-5">Nuova posizione</h2>

            <form action={addJob} className="space-y-4">
              <JobFields />

              <button
                type="submit"
                className="w-full py-2.5 bg-lavender text-ink text-sm font-semibold rounded-full shadow-soft transition hover:bg-lavender-dark hover:text-white active:scale-[0.98]"
              >
                Aggiungi posizione
              </button>
            </form>
          </div>

          {/* Lista posizioni */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink">Posizioni</h2>
              <span className="text-sm text-muted">{jobs?.length ?? 0} totali</span>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <SearchBox
                  action="/admin/contenuti/lavoro"
                  defaultValue={q}
                  placeholder="Cerca per titolo, categoria, sede…"
                  hidden={{ stato: stato !== 'tutte' ? stato : undefined }}
                />
              </div>
              <div className="flex gap-1 p-1 bg-lavender-light/60 rounded-full shrink-0">
                {FILTERS.map((f) => {
                  const active = stato === f.key
                  return (
                    <Link
                      key={f.key}
                      href={filterHref(f.key)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        active
                          ? 'bg-ink text-white shadow-sm'
                          : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      {f.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {!jobs || jobs.length === 0 ? (
              <div className="glass rounded-card shadow-soft px-6 py-12 text-center">
                <p className="text-sm text-muted">
                  {q || stato !== 'tutte'
                    ? 'Nessun risultato con questi filtri.'
                    : 'Nessuna posizione ancora. Aggiungine una con il form.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {jobs.map((job: Job) => (
                  <li
                    key={job.id}
                    className={`glass rounded-card shadow-soft px-6 py-5 flex items-start justify-between gap-4 transition hover:shadow-lift ${
                      editing?.id === job.id ? 'ring-2 ring-lavender' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink">{job.title}</p>
                        {job.category && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ink text-white">
                            {job.category}
                          </span>
                        )}
                      </div>
                      {job.location && (
                        <p className="mt-1 text-xs font-medium text-muted">📍 {job.location}</p>
                      )}
                      {job.description && (
                        <p className="mt-1 text-sm text-muted line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted">
                        {new Date(job.created_at).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-3">
                      <JobStatusToggle id={job.id} isOpen={!!job.is_open} action={toggleJobStatus} />
                      <Link
                        href={`/admin/contenuti/lavoro?edit=${job.id}`}
                        className="text-sm font-semibold text-lavender-dark border border-lavender/40 px-4 py-1.5 rounded-full transition hover:bg-lavender-light"
                      >
                        Modifica
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {editing && (
        <Modal title="Modifica posizione" closeHref="/admin/contenuti/lavoro">
          <form action={updateJob} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <JobFields values={editing} />

            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/admin/contenuti/lavoro"
                className="flex-1 py-2.5 text-center text-sm font-medium text-muted border border-haze rounded-full transition hover:bg-mist"
              >
                Annulla
              </Link>
              <button
                type="submit"
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
