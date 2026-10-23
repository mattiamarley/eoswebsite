// Keep the same cookie settings in the browser, server actions and proxy.
// Supabase SSR needs browser-readable session cookies; protect them with SameSite and HTTPS.
export const authCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}
