'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowIcon } from './ArrowIcon'

export function ProjectCarousel({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const multiple = images.length > 1
  function go(index: number) {
    const target = Math.max(0, Math.min(images.length - 1, index))
    const el = track.current
    if (!el) return
    el.scrollTo({ left: target * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="project-carousel" aria-label={`Fotografie di ${title}`} aria-roledescription="carosello">
    <div ref={track} className="project-carousel-track" tabIndex={multiple ? 0 : undefined}
      aria-label="Fotografie: usa le frecce o scorri lateralmente"
      onScroll={event => {
        const el = event.currentTarget
        setActive(Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / el.clientWidth))))
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); go(active + (event.key === 'ArrowLeft' ? -1 : 1)) }
        if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); go(event.key === 'Home' ? 0 : images.length - 1) }
      }}>
      {images.map((url, index) => <div className="project-carousel-slide" key={`${url}-${index}`} role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} di ${images.length}`}>
        <Image src={url} alt={`${title} — fotografia ${index + 1}`} width={1200} height={800} sizes="(max-width:760px) 90vw, 700px" className="project-carousel-photo" draggable={false}/>
      </div>)}
    </div>
    {multiple && <div className="project-carousel-controls">
      <button type="button" className="round-button glass" aria-label="Foto precedente" disabled={active === 0} onClick={() => go(active - 1)}><ArrowIcon direction="left"/></button>
      <span className="project-carousel-count" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} <span>/ {String(images.length).padStart(2, '0')}</span></span>
      <button type="button" className="round-button glass" aria-label="Foto successiva" disabled={active === images.length - 1} onClick={() => go(active + 1)}><span className="project-carousel-next"><ArrowIcon direction="left"/></span></button>
    </div>}
  </section>
}
