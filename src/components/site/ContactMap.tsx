'use client'

import { useState } from 'react'

export function ContactMap({city,address,zip}:{city:string;address:string;zip:string}) {
  const [enabled,setEnabled]=useState(false)
  return <div style={{width:'100%',minHeight:280,borderRadius:16,marginBottom:28,overflow:'hidden',background:'var(--color-mist)'}}>
    {enabled ? <iframe title={`Mappa della sede EOS di ${city}`} src={`https://www.google.com/maps?q=${encodeURIComponent(address+', '+zip+', Italia')}&output=embed`} width="600" height="280" referrerPolicy="no-referrer" style={{width:'100%',height:280,border:0}} allowFullScreen/> : <div style={{padding:28,display:'grid',gap:20,justifyItems:'start'}}>
      <p>La sede di {city}<br/>{address}, {zip}</p>
      <p style={{fontSize:14}}>La mappa è fornita da Google. Attivandola, il browser si collega al servizio esterno.</p>
      <button type="button" className="pill-button" onClick={()=>setEnabled(true)}>Carica la mappa</button>
    </div>}
  </div>
}
