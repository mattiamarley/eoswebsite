import { Suspense } from 'react'
import { ContentLoading } from '@/src/components/site/ContentLoading'
import { ContactMap } from '@/src/components/site/ContactMap'
import { ArrowIcon } from '@/src/components/site/ArrowIcon'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeading, ContactBanner } from '@/src/components/site/Sections'
import { Cards } from '@/src/components/site/Cards'
import { ContentCards } from '@/src/components/site/ContentCards'
import { lorem } from '@/src/lib/site-content'
import { AboutLayout } from '@/src/components/site/AboutLayout'
import { StudioLayout } from '@/src/components/site/StudioLayout'
const sections: Record<string,[string,string]> = {
  about:['Progettazione integrata','Competenze diverse, una direzione condivisa'],
  portfolio:['I nostri progetti','Dalla visione alla realizzazione'],
  studio:['Lo studio','Le persone dietro ogni progetto'],
  jobs:['Lavora con noi','Costruiamo insieme il prossimo passo'],
  contatti:['Parliamone insieme','Milano e Roma, un unico studio'],
  'privacy-policy':['Privacy policy','Informativa in preparazione'],
  'cookie-policy':['Cookie policy','Informativa in preparazione'],
}
export async function generateMetadata({params}: {params:Promise<{section:string}>}):Promise<Metadata> {const {section}=await params;return {title: `${sections[section]?.[0] ?? 'Pagina non trovata'} | EOS`}}
export default async function SectionPage({params}: {params:Promise<{section:string}>}) {
  const {section}=await params
  if(!sections[section]) notFound()
  if(section==='portfolio')return <ContentCards kind="projects" portfolioPage/>
  if(section==='about')return <AboutLayout/>
  if(section==='studio')return <StudioLayout/>
  const [title,subtitle]=sections[section]
  return <><PageHeading eyebrow={`EOS / ${section.includes('policy')?'INFORMAZIONI':section}`} title={title} subtitle={subtitle}/><div className="section-wrap page-content">
    {['about','studio','jobs'].includes(section) && <p className="body-copy page-intro">{lorem}</p>}
    {section==='about' && <><div className="section-heading"><h2>I nostri servizi<br/><span>Competenze e professionalità</span></h2></div><Cards kind="services"/></>}
    {section==='studio' && <ContentCards kind="team"/>}
    {section==='jobs' && <><Suspense fallback={<ContentLoading label="Caricamento posizioni"/>}><ContentCards kind="jobs"/></Suspense><div className="address-card" style={{marginTop:40}}><h2>Candidatura spontanea</h2><p className="body-copy">Non trovi la posizione che cerchi? Presentati al nostro team.</p><a href="mailto:eos@eosweb.it?subject=Candidatura%20spontanea" className="pill-button">Scrivici <ArrowIcon/></a></div></>}
    {section==='contatti' && <><div className="contact-methods"><a href="tel:+39022666092">+39 02 2666092 <ArrowIcon/></a><a href="mailto:eos@eosweb.it">eos@eosweb.it <ArrowIcon/></a><a href="mailto:eossrl@arubapec.it">eossrl@arubapec.it <ArrowIcon/></a></div><p className="body-copy">{lorem}</p><div className="contact-grid">{[['Milano','Via Nicola Antonio Porpora, 98','20131 Milano'],['Roma','Via dei Laterani, 36','00184 Roma']].map(([city,address,zip])=><article key={city} className="address-card">
<ContactMap city={city} address={address} zip={zip}/><span className="eyebrow">SEDE / {city}</span><h2>{city}</h2><p>{address}<br/>{zip}, Italia</p><a className="pill-button" style={{marginTop:25}} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address+', '+city)}`} target="_blank" rel="noopener noreferrer">Indicazioni stradali <ArrowIcon/></a></article>)}</div></>}
    {section.includes('policy') && <div className="empty-state"><p className="body-copy">Questa pagina è in preparazione. Il testo definitivo deve essere completato e verificato prima della pubblicazione del sito.</p><a href="mailto:eos@eosweb.it" className="pill-button">Contatta EOS <ArrowIcon/></a></div>}
  </div>{!section.includes('policy') && section!=='contatti' && <ContactBanner/>}</>
}
