'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowIcon } from './site/ArrowIcon'
import { EosBlueprint } from './site/EosBlueprint'
import { ConstructionProgress } from './site/ConstructionProgress'

export function Hero() {
  const ref=useRef<HTMLElement>(null)
  const reduced=useReducedMotion()
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
  const trace=useTransform(scrollYProgress,p=>Math.max(0,Math.min(1,p/.42)))
  const turn=useTransform(scrollYProgress,p=>{const t=Math.max(0,Math.min(1,(p-.64)/.22));return t*t*(3-2*t)})
  const volume=useTransform(scrollYProgress,p=>Math.max(0,Math.min(1,(p-.18)/.32)))
  const depth=useTransform(()=>volume.get()*(1-turn.get()))
  const solid=useTransform(scrollYProgress,p=>Math.max(0,Math.min(1,(p-.54)/.12)))
  const reveal=useTransform(scrollYProgress,p=>Math.max(0,Math.min(1,(p-.87)/.10)))
  const headingOpacity=useTransform(scrollYProgress,p=>1-Math.max(0,Math.min(1,(p-.58)/.10)))
  const revealY=useTransform(scrollYProgress,[.72,.94],[24,0])
  return <section ref={ref} className={`hero-scroll eos-hero ${reduced?'motion-static':''}`} aria-labelledby="hero-title">
    <div className="hero-sticky">
      <motion.div className="eos-opening" style={{opacity:reduced?0:headingOpacity}} aria-hidden="true">
        <p className="eyebrow">EOS / INGEGNERIA E PROGETTAZIONE</p>
        <p className="eos-opening-title">Competenze diverse<br/><span>un progetto integrato</span></p>
      </motion.div>
      <motion.div className="eos-drawing" style={{opacity:reduced?0:1}}>
        <EosBlueprint trace={trace} depth={depth} solid={solid} turn={turn} progress={scrollYProgress}/>
      </motion.div>
      <motion.div className="eos-reveal eos-reveal-continuous" style={{opacity:reduced?1:reveal,y:reduced?0:revealY}}>
        {reduced && <span className="eos-reveal-logo" aria-hidden="true">eos</span>}
        <h1 id="hero-title">Ogni progetto nasce<br/><span>da una visione</span></h1>
        <p className="hero-subtitle">Progettazione civile, ambiente e sicurezza</p>
      </motion.div>
      <div className="hero-foot">
        <a className="scroll-invitation" href="#introduzione"><ArrowIcon direction="down"/> Scorri per esplorare</a>
        <Link href="/portfolio" className="text-link">Esplora i progetti <ArrowIcon/></Link>
      </div>
      {!reduced && <ConstructionProgress progress={scrollYProgress}/>}
    </div>
  </section>
}
