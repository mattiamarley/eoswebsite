import Link from 'next/link'

export function AdminBackLink({href='/admin',toSite=false}:{href?:string;toSite?:boolean}) {
  return <Link href={href} className="admin-site-link admin-back-link shrink-0 gap-2" aria-label={toSite?'Torna al sito':'Indietro alla sezione precedente'}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg><span>{toSite?'Torna al sito':'Indietro'}</span></Link>
}
