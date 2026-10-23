'use client'

import { ArrowIcon } from '@/src/components/site/ArrowIcon'

import { useActionState, useId } from 'react'
import Link from 'next/link'
import { submitApplication } from '@/src/app/actions/applications'
export function ApplicationForm({jobId}: {jobId:string}) {
  const helpId=useId()
  const [state,action,pending]=useActionState(submitApplication,{success:false,message:''})
  if(state.success) return <div className="empty-state" role="status"><h3>Candidatura ricevuta</h3><p>{state.message}</p></div>
  return <form action={action} className="application-form">
    <h3>Invia la tua candidatura</h3>
    <input type="hidden" name="job_id" value={jobId}/>
    <div className="form-trap" aria-hidden="true"><label>Sito web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <div className="application-name-grid"><label>Nome *<input required name="first_name" autoComplete="given-name" maxLength={80}/></label><label>Cognome *<input required name="last_name" autoComplete="family-name" maxLength={80}/></label></div>
    <label>Email *<input required name="email" type="email" autoComplete="email" maxLength={254}/></label>
    <label>Telefono (facoltativo)<input name="phone" type="tel" autoComplete="tel" maxLength={30}/></label>
    <label>Curriculum *<input required disabled={pending} name="cv" type="file" accept="application/pdf,.pdf" aria-describedby={helpId}/></label>
    <label>Portfolio (facoltativo)<input disabled={pending} name="portfolio" type="file" accept="application/pdf,.pdf" aria-describedby={helpId}/></label>
    <p id={helpId}>Solo PDF, massimo 3 MB per documento. Non inserire dati sensibili non necessari alla candidatura.</p>
    <label>Presentati (facoltativo)<textarea name="message" maxLength={3000} rows={4} placeholder="Esperienza, interessi e disponibilità"/></label>
    <label className="consent"><input required type="checkbox" name="privacy"/> <span>Ho letto l’<Link href="/privacy-policy" target="_blank">informativa privacy</Link> sul trattamento dei dati della candidatura.</span></label>
    {state.message && <p role="alert">{state.message}</p>}
    <button disabled={pending} className="pill-button" type="submit">{pending?'Invio in corso…':'Invia candidatura'}{!pending && <ArrowIcon/>}</button>
  </form>
}
