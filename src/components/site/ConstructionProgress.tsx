'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

const steps = [
  {label:'Strutture',start:0,end:.32},
  {label:'Profondità',start:.32,end:.52},
  {label:'Architettura',start:.52,end:.66},
  {label:'Identità',start:.66,end:.97},
]

function Step({progress,index}:{progress:MotionValue<number>;index:number}) {
  const step=steps[index]
  const fill=useTransform(progress,p=>Math.max(0,Math.min(1,(p-step.start)/(step.end-step.start))))
  const opacity=useTransform(progress,p=>p>=step.start?1:.35)
  return <div style={{flex:1,minWidth:0}}>
    <motion.span style={{opacity,fontSize:9,letterSpacing:'.12em',display:'block',marginBottom:8,fontVariantNumeric:'tabular-nums'}}>0{index+1}</motion.span>
    <div className="carousel-progress-track">
      <motion.div className="carousel-progress-fill" style={{scaleX:fill}}/>
    </div>
  </div>
}

export function ConstructionProgress({progress}:{progress:MotionValue<number>}) {
  return <div aria-label="Fasi della costruzione: strutture, impianti, architettura, identità" style={{position:'absolute',bottom:112,left:'50%',transform:'translateX(-50%)',width:'min(320px, calc(100% - 64px))',display:'flex',gap:12,color:'var(--color-ink)',pointerEvents:'none'}}>
    {steps.map((step,index)=><Step key={step.label} progress={progress} index={index}/>)}
  </div>
}
