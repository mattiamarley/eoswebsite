'use client'
import Image from 'next/image'
import { useEffect,useState } from 'react'
import { useReducedMotion } from 'framer-motion'
export function PhotoShowcase({images}:{images:{src:string;alt:string}[]}){
 const [active,setActive]=useState(0),[paused,setPaused]=useState(false),[interacted,setInteracted]=useState(false)
 const reduced=useReducedMotion()
 useEffect(()=>{if(reduced||paused||interacted||images.length<2)return;const timer=setInterval(()=>{if(!document.hidden)setActive(value=>(value+1)%images.length)},5000);return()=>clearInterval(timer)},[reduced,paused,interacted,images.length])
 const move=(index:number)=>{setInteracted(true);setActive((index+images.length)%images.length)}
 return <section className="about-photo-showcase" aria-label="Immagini dei progetti" aria-roledescription="carosello" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPaused(false)}} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(active+(event.key==='ArrowLeft'?-1:1))}}}>
 {images.map((image,index)=><div key={`${image.src}-${index}`} className="about-photo-slide" data-active={index===active} aria-hidden={index!==active}><Image src={image.src} alt={image.alt} fill sizes="100vw" unoptimized={image.src.startsWith('blob:')}/></div>)}
 {images.length>1&&<div className="about-photo-controls"><button aria-label="Immagine precedente" onClick={()=>move(active-1)}>←</button>{images.map((image,index)=><button key={index} className="about-photo-dot" aria-label={`Mostra immagine ${index+1}: ${image.alt}`} aria-pressed={index===active} onClick={()=>move(index)}/>)}<button aria-label="Immagine successiva" onClick={()=>move(active+1)}>→</button><button aria-label={paused||interacted?'Riprendi carosello':'Metti in pausa il carosello'} onClick={()=>{if(paused||interacted){setPaused(false);setInteracted(false)}else setInteracted(true)}}>{paused||interacted?'▷':'Ⅱ'}</button></div>}
 </section>
}
