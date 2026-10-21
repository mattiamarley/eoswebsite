'use client'

import { ArrowIcon } from '@/src/components/site/ArrowIcon'


import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react'

export function GlassDialog({ title, children, onClose, returnFocus }: { title: string; children: ReactNode; onClose: () => void; returnFocus?: RefObject<HTMLButtonElement | null> }) {
  const titleId = useId()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const previous = returnFocus?.current ?? document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow; requestAnimationFrame(() => previous?.focus({preventScroll:true})) }
  }, [returnFocus])
  return <dialog ref={ref} className="detail-dialog" style={{backdropFilter: 'var(--dialog-glass-filter, blur(20px) saturate(135%) brightness(1.08))', WebkitBackdropFilter: 'var(--dialog-glass-filter, blur(20px) saturate(135%) brightness(1.08))'}}
    onPointerMove={event => {
      if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const panel = event.currentTarget
      const bounds = panel.getBoundingClientRect()
      panel.style.setProperty('--glass-light-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
      panel.style.setProperty('--glass-light-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
    }}
    onPointerLeave={event => {
      event.currentTarget.style.removeProperty('--glass-light-x')
      event.currentTarget.style.removeProperty('--glass-light-y')
    }}
    aria-labelledby={titleId} onCancel={e => {e.preventDefault(); onClose()}} onClick={e => { if(e.target !== e.currentTarget) return; const bounds=e.currentTarget.getBoundingClientRect(); if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom) onClose() }}>
    <div className="dialog-toolbar"><button type="button" autoFocus className="dialog-back" onClick={onClose}><ArrowIcon direction="left"/> Indietro</button></div>
    <div className="dialog-interior">
      <p className="eyebrow" style={{marginBottom:20}}>EOS / APPROFONDIMENTO</p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  </dialog>
}
