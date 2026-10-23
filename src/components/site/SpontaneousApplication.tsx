'use client'
import {useRef,useState} from 'react'
import {ApplicationForm} from './ApplicationForm'
import {GlassDialog} from './GlassDialog'
import {ArrowIcon} from './ArrowIcon'
export function SpontaneousApplication({enabled}:{enabled:boolean}){
 const [open,setOpen]=useState(false)
 const trigger=useRef<HTMLButtonElement|null>(null)
 return <section className="address-card spontaneous-application"><div><h2>Candidatura spontanea</h2><p className="body-copy">Non trovi la posizione che cerchi? Raccontaci chi sei e inviaci il tuo curriculum.</p></div><button ref={trigger} type="button" className="pill-button" aria-haspopup="dialog" onClick={()=>setOpen(true)}>Invia candidatura spontanea <ArrowIcon/></button>
 {open&&<GlassDialog title="Candidatura spontanea" onClose={()=>setOpen(false)} returnFocus={trigger}>{enabled?<ApplicationForm jobId={null}/>:<p className="body-copy" role="status">Il modulo di candidatura è in fase di attivazione. Riprova più tardi.</p>}</GlassDialog>}
 </section>
}
