'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { ArrowIcon } from './ArrowIcon'

export function MobileNavigation({links,path,onClose,trigger}:{links:string[][];path:string;onClose:()=>void;trigger:RefObject<HTMLButtonElement|null>}) {
  const ref=useRef<HTMLDialogElement>(null)
  const [closing,setClosing]=useState(false)
  useLayoutEffect(()=>{
    const dialog=ref.current!
    const triggerElement=trigger.current
    const previous=document.body.style.overflow
    const bounds=triggerElement?.getBoundingClientRect()
    if(bounds) dialog.style.top=`${bounds.top}px`
    dialog.showModal()
    document.body.style.overflow='hidden'
    return ()=>{dialog.close();document.body.style.overflow=previous;triggerElement?.focus({preventScroll:true})}
  },[trigger])
  useEffect(()=>{
    if(!closing)return
    // Complete dismissal even if the browser cancels the CSS animation.
    const timeout=window.setTimeout(onClose,350)
    return ()=>window.clearTimeout(timeout)
  },[closing,onClose])
  const close=()=>setClosing(true)
  return <dialog ref={ref} className={`mobile-nav-dialog ${closing?'is-closing':''}`} aria-label="Menu EOS"
    onCancel={e=>{e.preventDefault();close()}}
    onClick={e=>{if(e.target===e.currentTarget)close()}}
    onAnimationEnd={e=>{if(closing&&e.target===e.currentTarget)onClose()}}>
    <div className="mobile-nav-content">
      <div className="mobile-nav-top"><span className="mobile-nav-logo" aria-hidden="true">eos</span><button autoFocus onClick={close} className="round-button" aria-label="Chiudi menu">×</button></div>
      <nav className="mobile-links" aria-label="Navigazione mobile">
        {[[ '/', 'Home' ],...links].map(([href,label])=><Link key={href} href={href} onClick={onClose} aria-current={path===href?'page':undefined}>{label}<ArrowIcon/></Link>)}
      </nav>
    </div>
  </dialog>
}
