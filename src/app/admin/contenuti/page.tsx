import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'

const sections = [
  {
    href: '/admin/contenuti/studio',
    title: 'Carosello Studio',
    description: 'Carica, riordina e modifica le fotografie della pagina Studio.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>,
  },
  {
    href: '/admin/contenuti/about',
    title: 'Carosello About',
    description: 'Carica, riordina e modifica le fotografie del carosello About.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>,
  },
  {
    href: '/admin/contenuti/lavoro',
    title: 'Posizioni di lavoro',
    description: 'Gestisci le offerte di lavoro pubblicate sul sito.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    href: '/admin/contenuti/team',
    title: 'Team',
    description: 'Aggiungi, modifica e riordina i membri del team.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/contenuti/progetti',
    title: 'Progetti',
    description: 'Gestisci i progetti presenti nel portfolio.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3z" />
        <path d="M14 3h7v7h-7z" />
        <path d="M3 14h7v7H3z" />
        <path d="M17.5 14a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
      </svg>
    ),
  },
]

export default async function ContenutiPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted hover:text-ink transition">Dashboard</Link>
          <span aria-hidden="true" className="text-muted">/</span>
          <span className="font-semibold text-ink">Contenuti</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-ink">Contenuti del sito</h1>
          <p className="mt-1 text-sm text-muted">Scegli una sezione da gestire.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map(({ href, title, description, icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-4 glass rounded-card p-6 shadow-soft transition hover:shadow-lift"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-lavender-light text-lavender-dark group-hover:bg-ink group-hover:text-white transition">
                {icon}
              </div>
              <div>
                <h2 className="text-sm font-bold text-ink">{title}</h2>
                <p className="mt-1 text-sm text-muted leading-relaxed">{description}</p>
              </div>
              <div className="mt-auto text-xs font-medium text-muted group-hover:text-lavender-dark transition flex items-center gap-1">
                Gestisci
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
