import { Suspense } from 'react'
import { ContentLoading } from '@/src/components/site/ContentLoading'
import { ScrollReveal, ConstructedTitle } from '@/src/components/site/ScrollReveal'
import { ArrowIcon } from '@/src/components/site/ArrowIcon'
import Link from 'next/link'
import { Hero } from '@/src/components/Hero'
import { Intro, ContactBanner } from '@/src/components/site/Sections'
import { Cards } from '@/src/components/site/Cards'
import { ContentCards } from '@/src/components/site/ContentCards'
import { lorem } from '@/src/lib/site-content'
export default function Home() {
  return <><Hero/><Intro/><section className="expertise-band"><div className="section-wrap"><ScrollReveal><p className="eyebrow">IL METODO EOS</p></ScrollReveal><div className="intro-grid"><ConstructedTitle><h2>Dall’analisi dei bisogni<br/><span>al progetto integrato</span></h2></ConstructedTitle><ScrollReveal delay={.12}><p className="body-copy">{lorem}</p></ScrollReveal></div><Cards kind="services" limit={4}/><div className="flex justify-center"><Link href="/about" className="pill-button">Tutte le competenze <ArrowIcon/></Link></div></div></section><section className="section-wrap projects-section"><ScrollReveal construction><div className="section-heading"><div><p className="eyebrow">PORTFOLIO</p><h2>Progettiamo soluzioni<br/><span>per costruire valore</span></h2></div></div></ScrollReveal><Suspense fallback={<ContentLoading label="Caricamento progetti"/>}><ContentCards kind="projects" featured/></Suspense></section>
    <section className="section-wrap pb-[70px] md:pb-[110px]" aria-labelledby="project-approach-title">
      <p className="eyebrow">DAL CONCEPT ALLA REALIZZAZIONE</p>
      <div className="intro-grid">
        <h2 id="project-approach-title">Ogni progetto,<br/><span>una visione d’insieme</span></h2>
        <div>
          <p className="body-copy">Un progetto prende forma quando esigenze, idee e competenze trovano una direzione comune. Mettere in relazione architettura, strutture, impianti e sicurezza significa leggere ogni scelta nel suo contesto e costruire soluzioni coerenti con gli spazi e con le persone che li vivranno.</p>
          <p className="body-copy">Per EOS, progettare significa partire dall’ascolto, approfondire i vincoli e trasformare gli obiettivi in scelte concrete. Un percorso condiviso, in cui il confronto tra discipline accompagna lo sviluppo dell’intervento, dall’idea iniziale alla sua realizzazione.</p>
        </div>
      </div>
    </section>
    <ContactBanner/></>
}
