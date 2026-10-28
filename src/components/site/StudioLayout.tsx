import { Suspense } from 'react'
import { ContentLoading } from './ContentLoading'
import { SiteGallery } from './AboutGallery'
import Link from 'next/link'
import { ContentCards } from './ContentCards'
import { ScrollReveal } from './ScrollReveal'
import { Breadcrumbs } from './Breadcrumbs'
import { lorem } from '@/src/lib/site-content'

export function StudioLayout() {
  return <div className="studio-reference">
    <header className="studio-heading section-wrap"><Breadcrumbs current="Ufficio"/><h1>EOS Ufficio.</h1><p>La squadra.</p></header>
    <Suspense fallback={<div className="about-gallery-placeholder"/>}><SiteGallery galleryKey="studio"/></Suspense>
    <section className="studio-statistics" aria-label="L’ufficio in numeri">
      <ScrollReveal className="studio-stat"><h2>32<span>+</span></h2><h3>Dipendenti e collaboratori</h3><p className="body-copy">{lorem}</p></ScrollReveal>
      <ScrollReveal className="studio-stat studio-stat-right"><h2>353m²<span>+</span></h2><h3>Uffici e spazi comuni.</h3><p className="body-copy">{lorem}</p></ScrollReveal>
      <ScrollReveal className="studio-stat"><h2>60<span>%</span></h2><h3>Under 35</h3><p className="body-copy">{lorem}</p></ScrollReveal>
    </section>
    <section className="studio-crew section-wrap" aria-labelledby="studio-crew-title">
      <ScrollReveal className="studio-heading"><h2 id="studio-crew-title">EOS Ufficio.</h2><p>L’equipaggio.</p></ScrollReveal>
      <div className="studio-members"><Suspense fallback={<ContentLoading label="Caricamento team"/>}><ContentCards kind="team"/></Suspense></div>
      <section className="reference-closing"><ScrollReveal><h2>Il prossimo passo, insieme.</h2><p className="reference-closing-subtitle">Entra a far parte della squadra.</p><p className="body-copy">{lorem}</p><Link className="pill-button" href="/jobs">Sali a bordo</Link></ScrollReveal></section>
    </section>
  </div>
}
