'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { MobileNavigation } from './site/MobileNavigation'

const links = [['/about','About'],['/portfolio','Portfolio'],['/studio','Ufficio'],['/jobs','Jobs'],['/contatti','Contatti']]

export function Navbar() {
  const menuTrigger = useRef<HTMLButtonElement|null>(null)
  const [open,setOpen] = useState(false)
  const [hoverOpen,setHoverOpen] = useState(false)
  const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const cancelClose=()=>{if(closeTimer.current)clearTimeout(closeTimer.current)}
  const holdOpen=()=>{cancelClose();setIntroOpen(false);setHoverOpen(true)}
  const scheduleClose=()=>{cancelClose();closeTimer.current=setTimeout(()=>setHoverOpen(false),900)}
  useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current)},[])
  const path = usePathname()
  const [introOpen,setIntroOpen]=useState(false)
  useEffect(()=>{
    if(!window.matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)').matches)return
    try { if(sessionStorage.getItem('eos-nav-discovered'))return } catch {}
    const start=window.setTimeout(()=>{setIntroOpen(true);try {sessionStorage.setItem('eos-nav-discovered','1')} catch {}},250)
    const end=window.setTimeout(()=>setIntroOpen(false),3500)
    return ()=>{window.clearTimeout(start);window.clearTimeout(end)}
  },[])
  const renderLinks = (items:string[][]) => items.map(([href,label]) => <Link href={href} key={href} aria-current={path===href?'page':undefined}>{label}</Link>)
  return <>
    <a href="#main-content" className="skip-link">Vai al contenuto</a>
    <header className="site-header">
      <nav className="logo-navigation" data-intro-open={introOpen || hoverOpen || undefined} aria-label="Navigazione principale" onPointerEnter={holdOpen} onPointerLeave={scheduleClose} onFocusCapture={holdOpen} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))scheduleClose()}} onClick={()=>{cancelClose();setIntroOpen(false);setHoverOpen(false)}}>
        <div className="nav-wing nav-wing-left">{renderLinks(links.slice(0,3))}</div>
        <Link href="/" className="center-wordmark" aria-label="EOS — Homepage">eos</Link>
        <div className="nav-wing nav-wing-right">{renderLinks(links.slice(3))}</div>
      </nav>
      <div className="touch-navigation" style={{visibility:open?'hidden':'visible'}}>
        <button ref={menuTrigger} className="center-wordmark mobile-logo-trigger" onClick={()=>setOpen(true)} aria-label="Apri menu EOS" aria-haspopup="dialog" aria-expanded={open}>eos</button>
      </div>
    </header>
    {open && <MobileNavigation trigger={menuTrigger} links={links} path={path} onClose={()=>setOpen(false)}/>}

  </>
}
