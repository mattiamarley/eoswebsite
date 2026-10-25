import { AdminBackLink } from '@/src/app/admin/_components/AdminBackLink'
import { AdminSiteLink } from '@/src/app/admin/_components/AdminSiteLink'
import { requireAdmin } from '@/src/utils/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/src/utils/supabase/server'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin()

  const { count, error: applicationsError } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'nuova')
  const nuove = count ?? 0

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 min-h-16 py-3 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2"><AdminBackLink href="/"/><span className="text-lg font-bold tracking-tight text-ink">Eos Dashboard</span></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <AdminSiteLink/>
            <span className="text-sm text-muted hidden sm:block">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-muted hover:text-ink transition px-4 py-1.5 rounded-full hover:bg-haze"
              >
                Esci
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-ink">Benvenuto</h1>
          <p className="mt-1 text-sm text-muted">Cosa vuoi gestire oggi?</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            href="/admin/candidature"
            className="group relative flex flex-col gap-5 glass rounded-card p-7 shadow-soft transition hover:shadow-lift"
          >
            {nuove > 0 && (
              <span className="absolute top-5 right-5 min-w-[1.5rem] h-6 px-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                {nuove}
              </span>
            )}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-lavender-light text-lavender-dark group-hover:bg-ink group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 11h-6M19 8v6" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Candidature</h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {applicationsError ? 'Conteggio candidature temporaneamente non disponibile.' : nuove > 0
                  ? `${nuove} ${nuove === 1 ? 'nuova candidatura' : 'nuove candidature'} da esaminare.`
                  : 'Gestisci ed esamina le candidature ricevute.'}
              </p>
            </div>
            <div className="mt-auto text-xs font-medium text-muted group-hover:text-lavender-dark transition flex items-center gap-1">
              Apri Hub candidature
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/contenuti"
            className="group flex flex-col gap-5 glass rounded-card p-7 shadow-soft transition hover:shadow-lift"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-lavender-light text-lavender-dark group-hover:bg-ink group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h7v7H3z" />
                <path d="M14 3h7v7h-7z" />
                <path d="M3 14h7v7H3z" />
                <path d="M14 14h7v7h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Contenuti Sito</h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                Progetti, Team e Posizioni di lavoro pubblicate sul sito.
              </p>
            </div>
            <div className="mt-auto text-xs font-medium text-muted group-hover:text-lavender-dark transition flex items-center gap-1">
              Gestisci contenuti
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
