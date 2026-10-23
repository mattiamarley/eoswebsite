import { safeAdminRedirect, isAdmin, loginCredentials } from '@/src/lib/security'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirectTo, error } = await searchParams

  async function login(formData: FormData) {
    'use server'

    const credentials = loginCredentials(formData)
    const requested = String(formData.get('redirectTo') ?? '')
    const to = safeAdminRedirect(requested)

    const failureParams = new URLSearchParams({ error: 'invalid_credentials' })
    if (to !== '/admin') failureParams.set('redirectTo', to)
    if (!credentials) redirect(`/login?${failureParams}`)

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
      redirect(`/login?${failureParams}`)
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!isAdmin(user)) {
      await supabase.auth.signOut()
      redirect('/login?error=unauthorized')
    }
    redirect(to)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">Eos</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Accedi</h1>
          <p className="text-sm text-gray-500 mb-8">Area riservata — inserisci le tue credenziali</p>

          {(error === 'invalid_credentials' || error === 'unauthorized') && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              Accesso non consentito. Verifica le credenziali e i permessi del tuo account.
            </div>
          )}

          <form action={login} className="space-y-5">
            <input type="hidden" name="redirectTo" value={redirectTo ?? '/admin'} />

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="nome@azienda.com"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                maxLength={1024}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-gray-900 text-white text-sm font-medium rounded-lg transition hover:bg-gray-700 active:scale-[0.98]"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
