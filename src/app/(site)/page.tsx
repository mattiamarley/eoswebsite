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
  return <><Hero/><Intro/><section className="expertise-band"><div className="section-wrap"><ScrollReveal><p className="eyebrow">IL METODO EOS</p></ScrollReveal><div className="intro-grid"><ConstructedTitle><h2>Dall’analisi dei bisogni<br/><span>al progetto integrato</span></h2></ConstructedTitle><ScrollReveal delay={.12}><p className="body-copy">{lorem}</p></ScrollReveal></div><Cards kind="services" limit={4} animateEntrance/><Link href="/about" className="pill-button">Tutte le competenze <ArrowIcon/></Link></div></section><section className="section-wrap projects-section"><ScrollReveal construction><div className="section-heading"><div><p className="eyebrow">PORTFOLIO</p><h2>Progettiamo soluzioni<br/><span>per costruire valore</span></h2></div><Link href="/portfolio" className="pill-button">Esplora il portfolio <ArrowIcon/></Link></div></ScrollReveal><Suspense fallback={<ContentLoading label="Caricamento progetti"/>}><ContentCards kind="projects" featured/></Suspense></section><ContactBanner/></>
}
