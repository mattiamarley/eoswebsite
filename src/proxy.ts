import { createServerClient } from '@supabase/ssr'
import { isAdmin, safeAdminRedirect } from '@/src/lib/security'
import { PRIVATE_RESPONSE_HEADERS } from '@/src/lib/http-security'
import { authCookieOptions } from '@/src/utils/supabase/cookie-options'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          // Propaga i cookie aggiornati alla request (letti dai Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Ricrea la response includendo i cookie e gli header di cache aggiornati
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // IMPORTANTE: non inserire codice tra createServerClient e getUser().
  // Un errore qui causa logout casuali difficili da diagnosticare.
  const { data: { user }, error } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  if ((path === '/admin' || path.startsWith('/admin/')) && (error || !isAdmin(user))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('redirectTo', safeAdminRedirect(path))
    if (user && !isAdmin(user)) loginUrl.searchParams.set('error', 'unauthorized')
    const redirectResponse = NextResponse.redirect(loginUrl)
    supabaseResponse.cookies.getAll().forEach(cookie => redirectResponse.cookies.set(cookie))
    supabaseResponse = redirectResponse
  }

  Object.entries(PRIVATE_RESPONSE_HEADERS).forEach(([name, value]) => supabaseResponse.headers.set(name, value))
  return supabaseResponse
}

export const config = { matcher: ['/admin/:path*', '/login'] }
