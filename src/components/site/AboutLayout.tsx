import Link from 'next/link'
import { Suspense } from 'react'
import { PageHeading } from './Sections'
import { ScrollReveal } from './ScrollReveal'
import { Cards } from './Cards'
import { AboutGallery } from './AboutGallery'
import { lorem } from '@/src/lib/site-content'
const competencies=['Architettura & Permitting','Sicurezza & Antincendio','Programmazione e coordinamento lavori','Strutture','Impianti elettrici','Real estate valuation & Advisory','BIM','Impianti meccanici'].map((title,index)=>({id:`competenza-${index}`,title,category:'Competenza EOS',subtitle:'',variant:index%3}))
export function AboutLayout(){return <div className="about-reference">
  <PageHeading eyebrow="EOS / ABOUT" title="Progettazione integrata" subtitle="Competenze diverse, una direzione condivisa"/>
  <section className="section-wrap about-services" aria-labelledby="about-services-title"><div className="reference-section-heading"><h2 id="about-services-title">I nostri servizi.</h2><p>Competenze e professionalità.</p></div><div className="competencies-diagram"><div className="competencies-core">Direzione tecnica</div><Cards kind="services" data={competencies}/></div></section>
  <section className="about-numbers" aria-label="EOS in numeri">{[['30','Anni di esperienza.'],['140','Progetti completati.'],['9','Certificazioni ISO.']].map(([number,title],index)=><ScrollReveal key={title} className={`about-number ${index===1?'about-number-right':''}`}><h2>{number}<span>+</span></h2><h3>{title}</h3><p>{lorem}</p></ScrollReveal>)}<div className="about-ethics"><a className="pill-button" href="mailto:eos@eosweb.it?subject=Richiesta%20codice%20etico">Richiedi codice etico</a></div></section>
  <Suspense fallback={<div className="about-gallery-placeholder"/>}><AboutGallery/></Suspense>
  <section className="reference-closing section-wrap"><ScrollReveal><h2>Dalla visione al progetto.</h2><p className="reference-closing-subtitle">Soluzioni che prendono forma.</p><p className="body-copy">{lorem}</p><Link className="pill-button" href="/portfolio">Vai al portfolio</Link></ScrollReveal></section>
</div>}
