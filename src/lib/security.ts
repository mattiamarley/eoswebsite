/** Accept exact admin routes only; reject protocol-relative, encoded and backslash redirects. */
export function safeAdminRedirect(value:unknown):string {
  const path=typeof value==='string'?value:''
  return /^\/admin(?:\/[a-zA-Z0-9_-]+)*$/.test(path)?path:'/admin'
}
/** app_metadata is server managed. Never authorize using user_metadata. */
export function isAdmin(user:{app_metadata?:Record<string,unknown>}|null|undefined):boolean {
  return user?.app_metadata?.role==='admin'
}

export function validRecordId(value: unknown): value is string {
  return typeof value==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}
export function validContentForm(form: FormData, fields: Record<string,number>): boolean {
  return Object.entries(fields).every(([name,max])=>{
    const value=form.get(name)
    return value===null || (typeof value==='string' && value.length<=max && !value.includes('\0'))
  })
}

export function loginCredentials(form: FormData): {email:string;password:string} | null {
  const email=form.get('email'), password=form.get('password')
  if(typeof email!=='string' || email.length>254 || typeof password!=='string' || !password.length || password.length>1024 || password.includes('\0')) return null
  const normalized=email.trim()
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.includes('\0')) return null
  return {email:normalized,password}
}
