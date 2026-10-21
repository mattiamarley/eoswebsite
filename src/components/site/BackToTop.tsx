'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function BackToTop() {
  const [visible,setVisible]=useState(false)
  const pathname=usePathname()
  useEffect(()=>{
    const update=()=>setVisible(window.scrollY>400)
    update()
    window.addEventListener('scroll',update,{passive:true})
    return ()=>window.removeEventListener('scroll',update)
  },[pathname])

  function returnToTop() {
    const main=document.getElementById('main-content')
    main?.focus({preventScroll:true})
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
  }

  return <button type="button" className={`back-to-top ${visible?'is-visible':''}`} onClick={returnToTop} aria-label="Torna all’inizio della pagina" title="Torna all’inizio" tabIndex={visible?0:-1} aria-hidden={!visible}>
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 25V5M5 15 15 5l10 10"/></svg>
  </button>
}
