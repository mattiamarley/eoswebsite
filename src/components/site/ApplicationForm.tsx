'use client'

import { ArrowIcon } from '@/src/components/site/ArrowIcon'

import { useActionState } from 'react'
import Link from 'next/link'
import { submitApplication } from '@/src/app/actions/applications'
export function ApplicationForm({jobId}: {jobId:string}) {
  const [state,action,pending]=useActionState(submitApplication,{success:false,message:''})
  if(state.success) return <div className="empty-state" role="status"><h3>Candidatura ricevuta</h3><p>{state.message}</p></div>
  return <form action={action} className="application-form">
    <h3>Invia la tua candidatura</h3>
    <input type="hidden" name="job_id" value={jobId}/>
    <div className="form-trap" aria-hidden="true"><label>Sito web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label>Nome e cognome<input required name="name" autoComplete="name" maxLength={120}/></label>
    <label>Email<input required name="email" type="email" autoComplete="email" maxLength={254}/></label>
    <label>Telefono (facoltativo)<input name="phone" type="tel" autoComplete="tel" maxLength={30}/></label>
    <label>CV e portfolio in PDF<input required name="documents" type="file" accept="application/pdf,.pdf" multiple aria-describedby="file-help"/></label>
    <p id="file-help">Fino a 2 PDF, massimo 3 MB ciascuno</p>
    <label className="consent"><input required type="checkbox" name="privacy"/> <span>Ho letto l’<Link href="/privacy-policy" target="_blank">informativa privacy</Link> sul trattamento dei dati della candidatura.</span></label>
    {state.message && <p role="alert">{state.message}</p>}
    <button disabled={pending} className="pill-button" type="submit">{pending?'Invio in corso…':'Invia candidatura'}{!pending && <ArrowIcon/>}</button>
  </form>
}
