'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from 'react'
function subscribeMotion(callback:()=>void){
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change',callback)
  return ()=>preference.removeEventListener('change',callback)
}
const readReducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches
const serverReducedMotion=()=>true

export function useCarouselPlayback(count:number, onAdvance:()=>void, blocked=false) {
  const regionRef=useRef<HTMLElement>(null)
  const progressRef=useRef<HTMLSpanElement>(null)
  const reduced=useSyncExternalStore(subscribeMotion,readReducedMotion,serverReducedMotion)
  const [focused,setFocused]=useState(false)
  const [visible,setVisible]=useState(false)
  const [revision,setRevision]=useState(0)
  const playing=!reduced
  const restart=useCallback(()=>setRevision(value=>value+1),[])
  useEffect(()=>{
    const region=regionRef.current
    if(!region)return
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15})
    observer.observe(region)
    return ()=>observer.disconnect()
  },[])
  useEffect(()=>{
    if(!playing||focused||!visible||blocked||count<2)return
    let timer:ReturnType<typeof setTimeout>
    let animation:Animation|undefined
    function schedule(){
      clearTimeout(timer)
      animation?.cancel()
      if(document.hidden)return
      animation=progressRef.current?.animate(
        [{transform:'scaleX(0)'},{transform:'scaleX(1)'}],
        {duration:5000,easing:'linear',fill:'forwards'}
      )
      timer=setTimeout(()=>{onAdvance();schedule()},5000)
    }
    schedule()
    document.addEventListener('visibilitychange',schedule)
    return ()=>{clearTimeout(timer);animation?.cancel();document.removeEventListener('visibilitychange',schedule)}
  },[playing,focused,visible,blocked,count,onAdvance,revision])
  return {
    regionRef,progressRef,playing,restart,
    events:{
      onFocusCapture:(event:FocusEvent<HTMLElement>)=>setFocused(event.target.matches(':focus-visible')),
      onBlurCapture:(event:FocusEvent<HTMLElement>)=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)},
      onPointerDownCapture:restart,
    },
  }
}
