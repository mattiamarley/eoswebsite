export function ContentLoading({label="Caricamento contenuti"}:{label?:string}) {
  return <div className="content-loading" role="status"><span className="eyebrow">{label}</span><div aria-hidden="true"/></div>
}
