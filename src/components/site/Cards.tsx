'use client'

import { ArrowIcon } from '@/src/components/site/ArrowIcon'


import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import type { PublicCard } from './ContentCards'
import { ApplicationForm } from './ApplicationForm'
import { TeamProfile } from './TeamProfile'
import { GlassDialog } from './GlassDialog'
import { Blueprint } from './Blueprint'
import { ProjectCarousel } from './ProjectCarousel'
import { projectLabels } from '@/src/lib/project-tags'
import { lorem, projects, services } from '@/src/lib/site-content'

export function Cards({kind = 'projects', limit, data, applicationsEnabled = false, animateEntrance = false}: {kind?: 'projects'|'services'|'team'|'jobs'; limit?: number; data?:PublicCard[]; applicationsEnabled?:boolean; animateEntrance?:boolean}) {
  const reduced=useReducedMotion()
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [selected,setSelected] = useState<string|null>(null)
  const [teamCount,setTeamCount]=useState(12)
  const [filter,setFilter] = useState('Tutti')
  const items:PublicCard[] = data ?? (kind === 'services' ? services.map((title,i)=>({id:`servizio-${i}`,title,category:'Competenza EOS',subtitle:'Progettazione integrata',variant:i%3})) : projects)
  useEffect(()=> {
    const sync = () => setSelected(new URLSearchParams(window.location.hash.slice(1)).get('scheda'))
    sync(); window.addEventListener('popstate',sync); window.addEventListener('hashchange',sync)
    return ()=> {window.removeEventListener('popstate',sync); window.removeEventListener('hashchange',sync)}
  }, [])
  const item = items.find(i=>i.id===selected)
  function open(id:string) { window.history.pushState({eosDetail:true},'',`#scheda=${id}`); setSelected(id) }
  function close() { if(window.history.state?.eosDetail) window.history.back(); else {window.history.replaceState(null,'',window.location.pathname+window.location.search);setSelected(null)} }
  const shown = items.filter(i=>filter==='Tutti'||projectLabels(i).includes(filter)).slice(0,kind==='team'?teamCount:limit)
  return <>
    {kind==='projects' && !limit && <div className="filters" aria-label="Filtra progetti">{['Tutti',...new Set(items.flatMap(projectLabels))].map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{c}</button>)}</div>}
    <div className={`cards-grid ${kind}`}>
      {shown.map((i,index)=><motion.button initial={animateEntrance&&!reduced?'hidden':false} whileInView="visible" variants={{hidden:{opacity:0,y:58,scale:.94,rotateX:7},visible:{opacity:1,y:0,scale:1,rotateX:0}}} viewport={{once:true,amount:.12}} transition={{duration:reduced?0:1,delay:reduced?0:index%3*.16,ease:[.22,1,.36,1]}} key={i.id} className={`content-card variant-${i.variant}`} onClick={event=>{trigger.current=event.currentTarget;open(i.id)}} aria-haspopup="dialog">
        {(kind==='projects'||kind==='team') && <motion.div className="card-art" variants={{hidden:{clipPath:'inset(0 0 100% 0)'},visible:{clipPath:'inset(0 0 0% 0)'}}} transition={{duration:reduced?0:1.15,delay:reduced?0:.15+index%3*.16,ease:[.22,1,.36,1]}}>{i.images?.[0] ? <Image src={i.images[0]} alt={i.title} width={640} height={420} className="card-photo" sizes="(max-width:640px) 100vw, (max-width:1023px) 50vw, 33vw"/> : <Blueprint compact/>}<span className="art-index">EOS / 0{index+1}</span></motion.div>}
        <div className="card-body"><span className="eyebrow">{kind==='projects'?((projectLabels(i)[0]||'Progetto EOS')+(projectLabels(i).length>1?` +${projectLabels(i).length-1}`:'')):i.category}</span><h3>{i.title}</h3>{kind!=='services' && <p>{i.subtitle}</p>}<span className="card-arrow" aria-hidden="true">{kind==='team'?<span className="team-plus">+</span>:<ArrowIcon/>}</span></div>
      </motion.button>)}
    </div>
    {kind==='team'&&items.length>teamCount&&<div className="team-load-more"><button className="pill-button" onClick={()=>setTeamCount(count=>count+12)}>Carica altri</button><span className="sr-only" role="status">{shown.length} di {items.length} persone</span></div>}
    {kind==='projects' && !data && <p className="sample-note">Selezione illustrativa — progetti e immagini in corso di definizione</p>}
    {item && <GlassDialog title={item.title} onClose={close} returnFocus={trigger} variant={kind==='team'?'team':undefined}>
      {kind==='team'?<TeamProfile key={item.id} item={item}/>:<>
      {(kind==='projects'?projectLabels(item):[item.category]).map(label=><span key={label} className="category-chip" style={{marginRight:8}}>{label}</span>)}
      {item.images?.length ? kind==='projects' ? <ProjectCarousel key={item.id} images={item.images} title={item.title}/> : <div className="detail-gallery">{item.images.map(url=><Image key={url} src={url} alt={item.title} width={1200} height={800} sizes="(max-width:760px) 90vw, 700px" className="detail-photo"/>)}</div> : kind==='projects' && <div className={`dialog-art variant-${item.variant}`}><Blueprint compact/></div>}
      <p className="body-copy" style={{whiteSpace:'pre-line'}}>{item.description||lorem}</p>
      {kind==='jobs' ? applicationsEnabled ? <ApplicationForm jobId={item.id}/> : <p className="body-copy">Per informazioni sulla posizione, scrivi a <a href="mailto:eos@eosweb.it">eos@eosweb.it</a>. L’invio delle candidature dal sito sarà disponibile a breve.</p> : <Link className="pill-button" href="/contatti">Parliamone insieme <ArrowIcon/></Link>}
      </>}
    </GlassDialog>}
  </>
}
