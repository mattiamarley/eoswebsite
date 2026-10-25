'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon } from './ArrowIcon'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCarouselPlayback } from './useCarouselPlayback'
import type { PublicCard } from './ContentCards'
import { GlassDialog } from './GlassDialog'
import { ProjectCarousel } from './ProjectCarousel'
import { lorem } from '@/src/lib/site-content'

const samples:PublicCard[]=[
  {id:'concept-1',title:'Dialoghi di vetro',category:'Architettura integrata',subtitle:'Trasparenza, luce e nuove prospettive',variant:0,images:['/images/featured-stock-0.jpg']},
  {id:'concept-2',title:'Nuovi orizzonti',category:'Strutture e involucro',subtitle:'La precisione incontra lo spazio',variant:1,images:['/images/featured-stock-1.jpg']},
  {id:'concept-3',title:'Geometrie urbane',category:'Progettazione civile',subtitle:'Un equilibrio tra forma e funzione',variant:2,images:['/images/featured-stock-2.jpg']},
]

export function FeaturedProjects({items,previewOnly=false}:{items:PublicCard[];previewOnly?:boolean}) {
  const featured=items.filter(item=>item.is_featured)
  const mock=featured.length===0
  const slides=mock?(items.length?items.slice(0,6):process.env.NODE_ENV==='development'?samples:[]):featured
  const [active,setActive]=useState(0)
  const [selected,setSelected]=useState<string|null>(null)
  const detail=slides.find(item=>item.id===selected)
  const touchStart=useRef<{x:number;y:number}|null>(null)
  const trigger=useRef<HTMLButtonElement|null>(null)
  const current=slides.length?active%slides.length:0
  const count=slides.length
  const advance=useCallback(()=>setActive(value=>(value+1)%count),[count,setActive])
  const {regionRef,restart,events}=useCarouselPlayback(slides.length,advance,!!detail)
  useEffect(()=>{
    const sync=()=>setSelected(new URLSearchParams(window.location.hash.slice(1)).get('evidenza'))
    sync();window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync)
    return ()=>{window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync)}
  },[])
  function open(item:PublicCard){window.history.pushState({...window.history.state,eosFeatured:true},'',`#evidenza=${encodeURIComponent(item.id)}`);setSelected(item.id)}
  function close(){if(window.history.state?.eosFeatured)window.history.back();else{window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search);setSelected(null)}}
  function move(delta:number){restart();setActive((current+delta+slides.length)%slides.length)}
  const isDemo=mock && items.length===0 && process.env.NODE_ENV==='development'
  if(!slides.length)return null
  return <section className="featured-projects" aria-roledescription="carosello" aria-label={isDemo?'Anteprima del carosello progetti':'Progetti selezionati'} onKeyDown={e=>{if(detail)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}}} ref={regionRef} {...events}>
    <div className="featured-stage" onTouchStart={e=>{const point=e.touches[0];touchStart.current={x:point.clientX,y:point.clientY};restart()}} onTouchCancel={()=>{touchStart.current=null}} onTouchEnd={e=>{const start=touchStart.current;touchStart.current=null;if(!start||slides.length<2)return;const point=e.changedTouches[0];const dx=point.clientX-start.x;const dy=point.clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1)}}>
      {slides.map((item,index)=>{const offset=(index-current+slides.length)%slides.length;const position=offset===0?'current':offset===1?'next':offset===slides.length-1?'previous':'hidden';return <article key={item.id} className={`featured-slide is-${position}`} aria-hidden={index!==current} inert={index!==current}>
        {item.images?.[0]&&<Image src={item.images[0]} alt={item.title} fill sizes="(max-width:640px) 90vw, 80vw" priority={index===0}/>}
        <div className="featured-shade"/>
        <span className="featured-badge">{isDemo?'STUDIO VISIVO / MOCKUP':item.is_featured?'★ PROGETTO IN EVIDENZA':'PROGETTO EOS'}</span>
        <div className="featured-caption"><div><span className="featured-category">{item.tags?.join(' · ')||item.category}</span><h2>{item.title}</h2><p className="featured-summary">{previewOnly&&item.description?(item.description.length>210?item.description.slice(0,207).trimEnd()+'…':item.description):(item.subtitle||'Dalla visione alla realizzazione')}</p></div>
          {!previewOnly&&<button tabIndex={index===current?0:-1} className="featured-open" aria-label={`Scopri ${item.title}`} onClick={e=>{trigger.current=e.currentTarget;open(item)}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>}
        </div>
      </article>})}
    </div>
    {previewOnly&&<div className="featured-projects-cta"><Link className="pill-button" href="/portfolio#tutti-i-progetti">Tutti i progetti <ArrowIcon/></Link></div>}
    {!previewOnly&&detail&&<GlassDialog title={detail.title} onClose={close} returnFocus={trigger}>{isDemo&&<p className="body-copy">Anteprima grafica con fotografia stock. Non rappresenta un progetto realizzato da EOS.</p>}{Boolean(detail.images?.length)&&<ProjectCarousel images={detail.images!} title={detail.title}/>}<p className="body-copy" style={{whiteSpace:'pre-line'}}>{detail.description||lorem}</p></GlassDialog>}
  </section>
}
