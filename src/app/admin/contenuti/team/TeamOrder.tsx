'use client'

import Image from 'next/image'
import { useRef, useState, useTransition } from 'react'
import { reorderTeam } from './actions'

type Member = {id:string;full_name:string;job_tag:string|null;image_url:string|null}
export function TeamOrder({members,enabled,error}:{members:Member[];enabled:boolean;error?:string}) {
  const [items,setItems]=useState(members)
  const [saved,setSaved]=useState(members.map(m=>m.id).join(','))
  const [message,setMessage]=useState('')
  const [pending,startTransition]=useTransition()
  const dragged=useRef<string|null>(null)
  const dirty=items.map(m=>m.id).join(',')!==saved
  function move(id:string,to:number) {
    if(pending || !enabled || to<0 || to>=items.length)return
    setItems(current=>{const next=[...current];const from=next.findIndex(m=>m.id===id);if(from<0)return current;const [member]=next.splice(from,1);next.splice(to,0,member);return next})
    setMessage('Ordine modificato. Salva per aggiornare il sito.')
  }
  function save() {
    startTransition(async()=>{
      try {
        const result=await reorderTeam(items.map(m=>m.id))
        if(result.error)setMessage(result.error)
        else {setSaved(items.map(m=>m.id).join(','));setMessage('Ordine salvato. La pagina Ufficio è aggiornata.')}
      } catch {setMessage('Salvataggio non riuscito. Riprova senza chiudere la pagina.')}
    })
  }
  return <section className="team-order-panel glass rounded-card shadow-soft p-6 mb-10" aria-labelledby="team-order-title" aria-busy={pending}>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6"><div><h2 id="team-order-title" className="text-lg font-bold text-ink">Ordine delle schede sul sito</h2><p className="text-sm text-muted mt-2">Trascina le schede o usa le frecce. L’ordine va da sinistra a destra, riga per riga.</p></div><button type="button" disabled={!enabled || !dirty || pending} onClick={save} className="team-order-save">{pending?'Salvataggio…':'Salva ordine'}</button></div>
    {error&&<p className="text-sm text-red-700 mb-4" role="status">{error}</p>}
    <ol className="team-order-grid">{items.map((member,index)=><li key={member.id} draggable={enabled&&!pending} onDragStart={event=>{dragged.current=member.id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',member.id)}} onDragEnd={()=>{dragged.current=null}} onDragOver={event=>{if(enabled&&!pending)event.preventDefault()}} onDrop={event=>{event.preventDefault();if(dragged.current)move(dragged.current,index);dragged.current=null}}>
      <div className="team-order-preview">
        {member.image_url&&<Image src={member.image_url} alt="" fill sizes="(max-width:640px) 40vw, 240px" unoptimized/>}
        <div className="team-order-label"><strong>{member.full_name}</strong><span>{member.job_tag}</span></div>
        <span className="team-order-position" aria-label={`Posizione ${index+1}`}>{String(index+1).padStart(2,'0')}</span>
      </div>
      <div className="team-order-tools"><span className="text-xs text-muted">{index+1} / {items.length}</span><div className="flex gap-2"><button type="button" disabled={!enabled||pending||index===0} onClick={()=>move(member.id,index-1)} aria-label={`Sposta ${member.full_name} prima`}>←</button><button type="button" disabled={!enabled||pending||index===items.length-1} onClick={()=>move(member.id,index+1)} aria-label={`Sposta ${member.full_name} dopo`}>→</button></div></div>
    </li>)}</ol>
    {!items.length&&!error&&<p className="text-sm text-muted">Aggiungi il primo membro per visualizzare le schede.</p>}
    <p className="text-sm text-ink mt-4" role="status" aria-live="polite">{message}</p>
  </section>
}
