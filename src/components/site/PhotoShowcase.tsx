'use client'
import Image from 'next/image'
import { useCallback,useRef,useState } from 'react'
import { useCarouselPlayback } from './useCarouselPlayback'
import { CarouselProgress } from './CarouselProgress'
export type ShowcaseImage={src:string;alt:string;title?:string;description?:string}
export function PhotoShowcase({images,label="Immagini dei progetti"}:{images:ShowcaseImage[];label?:string}){
 const [active,setActive]=useState(0)
 const touchStart=useRef<{x:number;y:number}|null>(null)
 const count=images.length
 const advance=useCallback(()=>setActive(value=>(value+1)%count),[count,setActive])
 const {regionRef,progressRef,restart,events}=useCarouselPlayback(images.length,advance)
 const move=(index:number)=>{restart();setActive((index+images.length)%images.length)}
 return <section ref={regionRef} {...events} className="about-photo-showcase" aria-label={label} tabIndex={count>1?0:undefined} aria-roledescription="carosello" onKeyDown={event=>{if(images.length>1&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();move(active+(event.key==='ArrowLeft'?-1:1))}}}
 onTouchStart={event=>{const point=event.touches[0];touchStart.current={x:point.clientX,y:point.clientY}}} onTouchCancel={()=>{touchStart.current=null}} onTouchEnd={event=>{const start=touchStart.current;touchStart.current=null;if(!start||images.length<2)return;const point=event.changedTouches[0];const dx=point.clientX-start.x,dy=point.clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)move(active+(dx<0?1:-1))}}>
 {images.map((image,index)=><div key={`${image.src}-${index}`} className="about-photo-slide" data-active={index===active} aria-hidden={index!==active}><Image src={image.src} alt={image.alt} fill sizes="100vw" unoptimized={image.src.startsWith('blob:')}/><div className="photo-showcase-shade" aria-hidden="true"/><div className="photo-showcase-caption"><h2>{image.title||image.alt}</h2>{image.description&&<p>{image.description}</p>}</div></div>)}
 {count>1&&<CarouselProgress fillRef={progressRef} overlay/>}
 </section>
}
