import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'
import { toggleFavorite, updateStatus } from './actions'

type Application = {
  id: string
  job_id: string | null
  applicant_name: string | null
  email: string | null
  phone: string | null
  documents: string[] | null
  status: string | null
  is_favorite: boolean | null
  created_at: string
  jobs: { title: string | null } | null
}

type Props = {
  searchParams: Promise<{ tab?: string }>
}

const TABS = [
  { key: 'tutte', label: 'Tutte' },
  { key: 'nuove', label: 'Nuove' },
  { key: 'preferite', label: 'Preferite' },
] as const

const STATUS_OPTIONS = [
  { key: 'nuova', label: 'Nuova' },
  { key: 'letta', label: 'Letta' },
  { key: 'in_valutazione', label: 'In valutazione' },
] as const

const STATUS_BADGE: Record<string, string> = {
  nuova: 'bg-red-50 text-red-600 border-red-200',
  letta: 'bg-haze text-muted border-haze',
  in_valutazione: 'bg-lavender-light text-lavender-dark border-lavender/30',
}

function fileName(url: string): string {
  try {
    const path = new URL(url).pathname
    return decodeURIComponent(path.split('/').pop() || 'Documento')
  } catch {
    return 'Documento'
  }
}

export default async function CandidaturePage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()

  const { tab: tabParam } = await searchParams
  const tab = TABS.some((t) => t.key === tabParam) ? (tabParam as string) : 'tutte'

  const { data } = await supabase
    .from('applications')
    .select('id, job_id, applicant_name, email, phone, documents, status, is_favorite, created_at, jobs(title)')
    .order('created_at', { ascending: false })

  const all = (data ?? []) as unknown as Application[]
  // Store object paths; expose only short-lived signed links after requireAdmin().
  for (const application of all) {
    const urls = await Promise.all((application.documents ?? []).map(async (document) => {
      let path = document
      if (document.startsWith('http')) {
        const origin = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!origin || !document.startsWith(origin + '/storage/v1/object/')) return null
        const marker = '/applications-docs/'
        const index = document.indexOf(marker)
        if (index < 0) return null
        path = decodeURIComponent(document.slice(index + marker.length).split('?')[0])
      }
      const { data: signed } = await supabase.storage.from('applications-docs').createSignedUrl(path, 300)
      return signed?.signedUrl ?? null
    }))
    application.documents = urls.filter((url): url is string => Boolean(url))
  }

  const counts = {
    tutte: all.length,
    nuove: all.filter((a) => a.status === 'nuova').length,
    preferite: all.filter((a) => a.is_favorite).length,
  }

  const filtered = all.filter((a) => {
    if (tab === 'nuove') return a.status === 'nuova'
    if (tab === 'preferite') return a.is_favorite
    return true
  })

  const groupsMap = new Map<string, { title: string; items: Application[] }>()
  for (const app of filtered) {
    const key = app.job_id ?? 'no-job'
    if (!groupsMap.has(key)) {
      groupsMap.set(key, { title: app.jobs?.title || 'Posizione non specificata', items: [] })
    }
    groupsMap.get(key)!.items.push(app)
  }
  const groups = [...groupsMap.values()].sort((a, b) => {
    const aPending = a.items.some((i) => i.status === 'nuova') ? 1 : 0
    const bPending = b.items.some((i) => i.status === 'nuova') ? 1 : 0
    return bPending - aPending
  })

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted hover:text-ink transition">Dashboard</Link>
          <span className="text-haze">/</span>
          <span className="font-semibold text-ink">Candidature</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Hub candidature</h1>
          <p className="mt-1 text-sm text-muted">Esamina le candidature raggruppate per posizione.</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <Link
                key={t.key}
                href={t.key === 'tutte' ? '/admin/candidature' : `/admin/candidature?tab=${t.key}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  active
                    ? 'bg-ink text-white border-ink shadow-soft'
                    : 'glass text-ink-soft border-white/50 hover:text-ink'
                }`}
              >
                {t.label}
                <span
                  className={`min-w-[1.25rem] px-1.5 inline-flex items-center justify-center rounded-full text-xs ${
                    active ? 'bg-white/20 text-white' : 'bg-lavender-light text-lavender-dark'
                  }`}
                >
                  {counts[t.key]}
                </span>
              </Link>
            )
          })}
        </div>

        {groups.length === 0 ? (
          <div className="glass rounded-card shadow-soft px-6 py-12 text-center">
            <p className="text-sm text-muted">Nessuna candidatura in questa vista.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group, gi) => (
              <section key={gi}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-base font-bold text-ink">{group.title}</h2>
                  <span className="text-xs text-muted">
                    {group.items.length} {group.items.length === 1 ? 'candidatura' : 'candidature'}
                  </span>
                </div>

                <ul className="space-y-3">
                  {group.items.map((app) => (
                    <li key={app.id} className="glass rounded-card shadow-soft p-5 transition hover:shadow-lift">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-ink">
                              {app.applicant_name || 'Candidato senza nome'}
                            </p>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_BADGE[app.status ?? ''] ?? STATUS_BADGE.letta}`}>
                              {STATUS_OPTIONS.find((s) => s.key === app.status)?.label ?? app.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                            {app.email && (
                              <a href={`mailto:${app.email}`} className="hover:text-ink transition">{app.email}</a>
                            )}
                            {app.phone && (
                              <a href={`tel:${app.phone}`} className="hover:text-ink transition">{app.phone}</a>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            {new Date(app.created_at).toLocaleDateString('it-IT', {
                              day: '2-digit', month: 'long', year: 'numeric',
                            })}
                          </p>
                        </div>

                        <form action={toggleFavorite} className="shrink-0">
                          <input type="hidden" name="id" value={app.id} />
                          <input type="hidden" name="current" value={String(!!app.is_favorite)} />
                          <button
                            type="submit"
                            aria-label={app.is_favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                            className={`w-9 h-9 flex items-center justify-center rounded-full border transition ${
                              app.is_favorite
                                ? 'border-amber-200 bg-amber-50 text-amber-500'
                                : 'border-white/50 text-muted hover:text-amber-400 hover:bg-amber-50 hover:border-amber-200'
                            }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={app.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        </form>
                      </div>

                      {app.documents && app.documents.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {app.documents.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-dark border border-lavender/40 px-3 py-1.5 rounded-full transition hover:bg-lavender-light"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                              </svg>
                              <span className="max-w-[180px] truncate">{fileName(url)}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      <form action={updateStatus} className="mt-4 flex flex-wrap items-center gap-2">
                        <input type="hidden" name="id" value={app.id} />
                        <span className="text-xs font-medium text-muted mr-1">Stato:</span>
                        {STATUS_OPTIONS.map((s) => {
                          const active = app.status === s.key
                          return (
                            <button
                              key={s.key}
                              type="submit"
                              name="status"
                              value={s.key}
                              disabled={active}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                                active
                                  ? 'bg-ink text-white border-ink cursor-default'
                                  : 'glass text-ink-soft border-white/50 hover:text-ink'
                              }`}
                            >
                              {s.label}
                            </button>
                          )
                        })}
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
