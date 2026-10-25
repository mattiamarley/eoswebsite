'use client'
import Image from 'next/image'
import { useEffect,useRef,useState,useTransition } from 'react'
import { compressImage } from '../../_components/compressImage'
import { PhotoShowcase } from '@/src/components/site/PhotoShowcase'
import { ABOUT_GALLERY_MAX,galleryUploadError,type GalleryKey,type AboutGallery,type GallerySlide } from '@/src/lib/about-gallery'
import { saveAboutGallery } from './actions'
type Draft=GallerySlide&{file?:File}
export function AboutGalleryEditor({initial,galleryKey='about'}:{initial:AboutGallery;galleryKey?:GalleryKey}){
  const label=galleryKey==='studio'?'Studio':'About'
  const [saved,setSaved]=useState(initial)
  const [items,setItems]=useState<Draft[]>(initial.slides??[])
  const [busy,setBusy]=useState(false),[pending,startTransition]=useTransition()
  const [message,setMessage]=useState(''),[failed,setFailed]=useState(false),[preview,setPreview]=useState(false)
  const blobs=useRef(new Set<string>())
  const dragged=useRef<string|null>(null)
  const locked=busy||pending
  const dirty=saved.slides===null||JSON.stringify(items.map(({id,src,alt,title,description})=>({id,src,alt,title:title??'',description:description??''})))!==JSON.stringify(saved.slides)
  useEffect(()=>{const urls=blobs.current;return()=>{urls.forEach(url=>URL.revokeObjectURL(url));urls.clear()}},[])
  function error(text:string){setFailed(true);setMessage(text)}
  async function pick(event:React.ChangeEvent<HTMLInputElement>){
    const files=Array.from(event.currentTarget.files??[]);event.currentTarget.value=''
    if(!files.length)return
    if(files.length+items.length>ABOUT_GALLERY_MAX)return error('Puoi inserire fino a 8 foto. Rimuovine una prima di aggiungerne altre.')
    if(files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)))return error('Seleziona immagini JPEG, PNG o WebP.')
    setBusy(true);setMessage('');setFailed(false)
    try{
      const compressed=await Promise.all(files.map(compressImage))
      const problem=galleryUploadError([...items.flatMap(item=>item.file?[item.file]:[]),...compressed])
      if(problem)return error(problem)
      const added=compressed.map(file=>{const src=URL.createObjectURL(file);blobs.current.add(src);return {id:crypto.randomUUID(),src,alt:'',file}})
      setItems(current=>[...current,...added]);setMessage('Foto aggiunte alla bozza. Compila i testi alternativi e salva per pubblicarle.')
    }catch{error('Impossibile preparare le foto. Prova con un altro file.')}finally{setBusy(false)}
  }
  function move(id:string,to:number){if(locked||to<0||to>=items.length)return;setItems(current=>{const next=[...current],from=next.findIndex(item=>item.id===id);if(from<0)return current;const [item]=next.splice(from,1);next.splice(to,0,item);return next});setMessage(`Ordine modificato. Salva per aggiornare ${label}.`);setFailed(false)}
  function remove(id:string){setItems(current=>{const item=current.find(item=>item.id===id);if(item?.file){URL.revokeObjectURL(item.src);blobs.current.delete(item.src)}return current.filter(item=>item.id!==id)});setMessage('Foto rimossa dalla bozza. Salva per confermare.');setFailed(false)}
  function reset(){blobs.current.forEach(url=>URL.revokeObjectURL(url));blobs.current.clear();setItems(saved.slides??[]);setMessage('Modifiche annullate.');setFailed(false)}
  function save(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    if(locked)return
    const form=new FormData()
    form.set('revision',String(saved.revision))
    form.set('slides',JSON.stringify(items.map(({id,src,alt,title,description,file})=>({id,src:file?'':src,alt,title:title??'',description:description??''}))))
    items.forEach(item=>{if(item.file)form.set(`image:${item.id}`,item.file)})
    setMessage('');setFailed(false)
    startTransition(async()=>{
      try{const result=await saveAboutGallery(form,galleryKey);setMessage(result.message);setFailed(!result.success)
        if(result.success&&result.gallery){setSaved(result.gallery);setItems(result.gallery.slides??[]);blobs.current.forEach(url=>URL.revokeObjectURL(url));blobs.current.clear()}
      }catch{error('Salvataggio non riuscito. La bozza è ancora disponibile: riprova.')}
    })
  }
  return <form onSubmit={save} className="glass rounded-card shadow-soft p-6" aria-busy={locked}>
    <p className="text-sm text-muted mb-5">Fino a 8 foto. Trascinale oppure usa le frecce per riordinarle. Le modifiche diventano pubbliche solo premendo “Salva carosello”.</p>
    {saved.slides===null&&<p className="rounded-xl bg-lavender-light p-4 text-sm text-ink mb-5">Non hai ancora una selezione dedicata: {label} usa {galleryKey==='studio'?'la foto iniziale dello studio':'le foto dei progetti'}. Il primo salvataggio sostituirà questa selezione automatica.</p>}
    <fieldset disabled={locked}>
      <div className="flex flex-wrap items-center gap-3 mb-6"><label className={`team-order-save cursor-pointer ${items.length>=ABOUT_GALLERY_MAX?'opacity-40':''}`}><span>Aggiungi foto</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={pick} disabled={locked||items.length>=ABOUT_GALLERY_MAX} className="sr-only" aria-label="Aggiungi foto al carosello"/></label><span className="text-sm text-muted">{items.length} / {ABOUT_GALLERY_MAX}</span><button type="button" className="rounded-full border px-4 py-2 text-sm" disabled={!items.length} onClick={()=>setPreview(value=>!value)}>{preview?'Nascondi anteprima':'Anteprima carosello'}</button></div>
      <p className="text-xs text-muted mb-6">JPEG, PNG o WebP. Ottimizzazione automatica; massimo 3 MB per foto e 4 MB complessivi di nuovi file per salvataggio.</p>
      {preview&&items.length>0&&<div className="about-gallery-preview mb-6"><PhotoShowcase key={items.map(item=>item.id).join(',')} images={items.map(item=>({src:item.src,alt:item.alt||'Anteprima foto',title:item.title,description:item.description}))}/></div>}
      {!items.length&&<div className="rounded-2xl border border-dashed border-lavender p-8 text-center text-sm text-muted mb-5">Aggiungi le foto che vuoi mostrare. Salvando senza foto, nasconderai il carosello {label}.</div>}
      <ol className="about-gallery-editor-grid">{items.map((item,index)=><li key={item.id} draggable={!locked} onDragStart={event=>{if((event.target as HTMLElement).closest('input,textarea,button,label')){event.preventDefault();return}dragged.current=item.id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',item.id)}} onDragEnd={()=>{dragged.current=null}} onDragOver={event=>{if(!locked)event.preventDefault()}} onDrop={event=>{event.preventDefault();if(dragged.current)move(dragged.current,index);dragged.current=null}} className="rounded-2xl border border-white/70 bg-white/40 overflow-hidden">
        <div className="about-gallery-thumbnail"><Image src={item.src} alt={item.alt||`Anteprima foto ${index+1}`} fill unoptimized sizes="(max-width:640px) 90vw, 33vw" draggable={false}/><span>{String(index+1).padStart(2,'0')}{item.file?' · Nuova':''}</span></div>
        <div className="p-4"><label htmlFor={`alt-${item.id}`} className="text-xs font-semibold text-ink">Testo alternativo *</label><input id={`alt-${item.id}`} className="w-full rounded-lg border border-haze bg-white/70 p-2 mt-2 text-sm" required maxLength={160} value={item.alt} onChange={event=>setItems(current=>current.map(photo=>photo.id===item.id?{...photo,alt:event.target.value}:photo))} placeholder="Descrivi brevemente la foto"/>
        <label htmlFor={`title-${item.id}`} className="block text-xs font-semibold text-ink mt-4">Titolo sulla foto</label><input id={`title-${item.id}`} className="w-full rounded-lg border border-haze bg-white/70 p-2 mt-2 text-sm" maxLength={120} value={item.title??''} onChange={event=>setItems(current=>current.map(photo=>photo.id===item.id?{...photo,title:event.target.value}:photo))} placeholder="Es. Spazi che prendono forma"/><p className="text-xs text-muted mt-1">Se vuoto, viene mostrato il testo alternativo.</p>
        <label htmlFor={`description-${item.id}`} className="block text-xs font-semibold text-ink mt-4">Descrizione sulla foto</label><textarea id={`description-${item.id}`} className="w-full rounded-lg border border-haze bg-white/70 p-2 mt-2 text-sm" rows={3} maxLength={600} value={item.description??''} onChange={event=>setItems(current=>current.map(photo=>photo.id===item.id?{...photo,description:event.target.value}:photo))} placeholder="Una breve descrizione da mostrare sotto il titolo"/>
        <div className="about-gallery-tools"><div className="flex gap-2"><button type="button" disabled={locked||index===0} onClick={()=>move(item.id,index-1)} aria-label={`Sposta foto ${index+1} prima`}>←</button><button type="button" disabled={locked||index===items.length-1} onClick={()=>move(item.id,index+1)} aria-label={`Sposta foto ${index+1} dopo`}>→</button></div><button type="button" onClick={()=>remove(item.id)} className="text-red-700" aria-label={`Rimuovi foto ${index+1}`}>Rimuovi</button></div></div>
      </li>)}</ol>
      <div className="flex flex-wrap gap-3 mt-7"><button type="submit" className="team-order-save" disabled={locked||!dirty}>{pending?'Salvataggio…':'Salva carosello'}</button><button type="button" className="rounded-full border px-5 py-2 text-sm" disabled={locked||!dirty} onClick={reset}>Annulla modifiche</button></div>
    </fieldset>
    {busy&&<p role="status" className="text-sm mt-4">Ottimizzazione delle foto…</p>}
    <p role={failed?'alert':'status'} aria-live="polite" className={`text-sm mt-4 ${failed?'text-red-700':'text-ink'}`}>{message}</p>
  </form>
}
