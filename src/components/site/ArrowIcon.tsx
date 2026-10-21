/** Thin, geometric arrows independent of the operating system's font glyphs. */
export function ArrowIcon({direction='up-right'}:{direction?:'up-right'|'left'|'down'}) {
  return <svg className="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={direction==='left'?'M20 12H4M11 5l-7 7 7 7':direction==='down'?'M12 4v16M5 13l7 7 7-7':'M5 19 19 5M5 5h14v14'}/>
  </svg>
}
