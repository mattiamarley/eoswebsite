'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { PublicCard } from './ContentCards'
import { ArrowIcon } from './ArrowIcon'
import { lorem } from '@/src/lib/site-content'

/** Paginate long biographies within the available space instead of nesting a scrollbar. */
export function TeamProfile({item}:{item:PublicCard}) {
  const copy=item.description?.trim()||lorem
  const measure=useRef<HTMLParagraphElement>(null)
  const box=useRef<HTMLDivElement>(null)
  const [pages,setPages]=useState<string[]>([])
  const [page,setPage]=useState(0)
  useEffect(()=>{
    const target=box.current!, probe=measure.current!
    let frame=0
    let disposed=false
    const paginate=()=>{
      if(disposed)return
      cancelAnimationFrame(frame)
      frame=requestAnimationFrame(()=>{
        const words=copy.split(/\s+/), result:string[]=[]
        let start=0
        while(start<words.length){
          let low=start+1,high=words.length,best=start+1
          while(low<=high){
            const end=Math.floor((low+high)/2)
            probe.textContent=words.slice(start,end).join(' ')
            if(probe.scrollHeight<=target.clientHeight){best=end;low=end+1}else high=end-1
          }
          result.push(words.slice(start,best).join(' '));start=best
        }
        probe.textContent=''
        setPages(result);setPage(0)
      })
    }
    const observer=new ResizeObserver(paginate)
    observer.observe(target)
    void document.fonts.ready.then(paginate)
    return ()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame)}
  },[copy])
  return <div className="team-profile">
    <div className="team-profile-portrait">{item.images?.[0]?<Image src={item.images[0]} alt={item.title} width={320} height={400} sizes="(max-width:600px) 80px, 180px"/>:<span aria-hidden="true">{item.title.split(/\s+/).slice(0,2).map(word=>word[0]).join('')}</span>}</div>
    <div className="team-profile-info">
      <p className="eyebrow">IL TEAM EOS</p>
      <h3>{item.title}</h3><p className="team-profile-role">{item.category}</p>
      <div className="team-profile-copy-box" ref={box} style={pages.length===1?{height:'auto'}:undefined}>
        <p className="team-profile-copy" aria-live="polite">{pages[page]??''}</p>
        <p ref={measure} className="team-profile-copy team-profile-measure" aria-hidden="true"/>
      </div>
      <div className="team-profile-pagination">{pages.length>1&&<>
        <button type="button" aria-label="Descrizione precedente" disabled={page===0} onClick={()=>setPage(value=>value-1)}><ArrowIcon direction="left"/></button>
        <span>{page+1} / {pages.length}</span>
        <button type="button" aria-label="Continua la descrizione" disabled={page===pages.length-1} onClick={()=>setPage(value=>value+1)}><span className="team-profile-next"><ArrowIcon direction="left"/></span></button>
      </>}</div>
    </div>
  </div>
}
