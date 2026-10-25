import type { RefObject } from 'react'

/** Decorative countdown driven by the same timer that advances the photo. */
export function CarouselProgress({fillRef,overlay=false}:{fillRef:RefObject<HTMLSpanElement|null>;overlay?:boolean}){
  return <div className={`carousel-progress${overlay?' carousel-progress-overlay':''}`} aria-hidden="true"><span className="carousel-progress-track"><span ref={fillRef} className="carousel-progress-fill"/></span></div>
}
