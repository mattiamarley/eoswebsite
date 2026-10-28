'use client'
export default function Error({reset}:{reset:()=>void}){return <div className="section-wrap page-heading"><h1>Qualcosa non ha funzionato</h1><p className="body-copy">Riprova oppure contatta l’ufficio.</p><button className="pill-button" onClick={reset}>Riprova</button></div>}
