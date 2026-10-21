'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function ScrollReveal({children,className,delay=0,construction=false}:{children:ReactNode;className?:string;delay?:number;construction?:boolean}) {
  const reduced=useReducedMotion()
  return <motion.div className={className} style={construction?{position:'relative'}:undefined}
    initial={reduced?false:'hidden'} whileInView="visible" viewport={{once:true,amount:.2}}
    variants={{hidden:{opacity:0,y:construction?48:28},visible:{opacity:1,y:0}}}
    transition={{duration:reduced?0:1,delay:reduced?0:delay,ease:[.16,1,.3,1]}}>
    {construction && <motion.span aria-hidden="true" style={{position:'absolute',left:0,right:0,top:-18,height:1,background:'currentColor',opacity:.24,transformOrigin:'left'}}
      variants={{hidden:{scaleX:0},visible:{scaleX:1}}} transition={{duration:reduced?0:1.2,delay:reduced?0:delay+.1,ease:[.22,1,.36,1]}}/>}
    {children}
  </motion.div>
}

export function ConstructedTitle({children}:{children:ReactNode}) {
  const reduced=useReducedMotion()
  // Observe the unclipped wrapper: a fully clipped target never intersects.
  return <motion.div style={{overflow:'clip',paddingBottom:6}}
    initial={reduced?false:'hidden'} whileInView="visible" viewport={{once:true,amount:.15}}>
    <motion.div variants={{hidden:{y:50,opacity:0,clipPath:'inset(0 0 100% 0)'},visible:{y:0,opacity:1,clipPath:'inset(0 0 0% 0)'}}}
      transition={{duration:reduced?0:1,ease:[.16,1,.3,1]}}>{children}</motion.div>
  </motion.div>
}
