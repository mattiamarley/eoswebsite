'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FeaturedProjects } from './FeaturedProjects'
import type { PublicCard } from './ContentCards'
import { Cards } from './Cards'
import { ScrollReveal } from './ScrollReveal'
import { Breadcrumbs } from './Breadcrumbs'
import { lorem, projects } from '@/src/lib/site-content'

export function PortfolioLayout({items,sample=false}:{items:PublicCard[];sample?:boolean}) {
  return <div className="portfolio-reference">
    <header className="portfolio-heading section-wrap"><Breadcrumbs current="Portfolio"/><h1>Portfolio eos</h1><p>Progetti in evidenza</p><a className="pill-button" style={{marginTop:24,fontSize:14}} href="#tutti-i-progetti">Esplora tutti i progetti <span aria-hidden="true">↓</span></a></header>
    <FeaturedProjects items={items}/>
    <section className="portfolio-statistics section-wrap" aria-label="EOS in numeri">
      <ScrollReveal className="portfolio-stat"><h2>45<span>+</span></h2><h3>Clienti attivi</h3><p className="body-copy">{lorem}</p></ScrollReveal>
      <ScrollReveal className="portfolio-stat portfolio-stat-right"><h2>125.000 m²<span>+</span></h2><h3>Superficie progettata</h3><p className="body-copy">{lorem}</p></ScrollReveal>
    </section>
    <section className="portfolio-clients" aria-label="Clienti EOS">
      <ScrollReveal><h2>Una rete globale</h2><p>Lavoriamo con:</p></ScrollReveal>
      <div className="client-ribbon">
        <div className="client-ribbon-track">
          <Image src="/images/clienti-banda.png" alt="ING, Generali, Thales Alenia Space, RAI, Hilton, Bracco, Milanosport, Procos, INAIL e Uvet" width={4575} height={238} className="client-ribbon-image"/>
          <Image src="/images/clienti-banda.png" alt="" aria-hidden="true" width={4575} height={238} className="client-ribbon-image"/>
        </div>
      </div>
    </section>
    <section id="tutti-i-progetti" className="section-wrap portfolio-projects" aria-labelledby="portfolio-all-title" style={{scrollMarginTop:110}}>
      <div className="section-heading"><h2 id="portfolio-all-title">Tutti i progetti</h2><p className="body-copy">Esplora il portfolio completo e filtra per competenza.</p></div>
      <Cards kind="projects" data={sample?undefined:items} animateEntrance/>
      <div className="portfolio-bottom"><Link className="pill-button" href="/contatti">Parliamo del tuo progetto</Link></div>
    </section>
  </div>
}

export function SamplePortfolio(){return <PortfolioLayout items={projects} sample/>}
