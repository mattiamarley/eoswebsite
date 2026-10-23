'use client'

import { ArrowIcon } from '@/src/components/site/ArrowIcon'

import { useActionState, useId, useState } from 'react'
import Link from 'next/link'
import { applicationSizeError } from '@/src/lib/application-limits'
import { submitApplication } from '@/src/app/actions/applications'
export function ApplicationForm({jobId}: {jobId:string|null}) {
  const helpId=useId()
  const [fileError,setFileError]=useState('')
  const [state,action,pending]=useActionState(submitApplication,{success:false,message:''})
  if(state.success) return <div className="empty-state" role="status"><h3>Candidatura ricevuta</h3><p>{state.message}</p></div>
  return <form action={action} className="application-form" onSubmit={event=>{const form=new FormData(event.currentTarget);const files=[form.get('cv'),form.get('portfolio')].filter((file):file is File=>file instanceof File);const error=applicationSizeError(files);setFileError(error??'');if(error)event.preventDefault()}}>
    <h3>Invia la tua candidatura</h3>
    <input type="hidden" name="job_id" value={jobId??''}/>
    <input type="hidden" name="application_type" value={jobId?'position':'spontaneous'}/>
    <div className="form-trap" aria-hidden="true"><label>Sito web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <div className="application-name-grid"><label>Nome *<input required name="first_name" autoComplete="given-name" maxLength={80}/></label><label>Cognome *<input required name="last_name" autoComplete="family-name" maxLength={80}/></label></div>
    <label>Email *<input required name="email" type="email" autoComplete="email" maxLength={254}/></label>
    <label>Telefono (facoltativo)<input name="phone" type="tel" autoComplete="tel" maxLength={30}/></label>
    <label>Curriculum *<input required disabled={pending} name="cv" type="file" accept="application/pdf,.pdf" aria-describedby={helpId}/></label>
    <label>Portfolio (facoltativo)<input disabled={pending} name="portfolio" type="file" accept="application/pdf,.pdf" aria-describedby={helpId}/></label>
    <p id={helpId}>Solo PDF, massimo 3 MB per documento e 4 MB complessivi. Non inserire dati sensibili non necessari alla candidatura.</p>
    <label>Presentati (facoltativo)<textarea name="message" maxLength={3000} rows={4} placeholder="Esperienza, interessi e disponibilità"/></label>
    <label className="consent"><input required type="checkbox" name="privacy"/> <span>Ho letto l’<Link href="/privacy-policy" target="_blank">informativa privacy</Link> sul trattamento dei dati della candidatura.</span></label>
    {(fileError||state.message) && <p role="alert">{fileError||state.message}</p>}
    <button disabled={pending} className="pill-button" type="submit">{pending?'Invio in corso…':'Invia candidatura'}{!pending && <ArrowIcon/>}</button>
  </form>
}
