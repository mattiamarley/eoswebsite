import type { Metadata } from 'next'

// Keep production canonicals stable on preview deployments and localhost.
const configuredUrl = new URL(process.env.SITE_URL || 'https://eoswebsite.vercel.app')
if (configuredUrl.protocol !== 'https:' || configuredUrl.username || configuredUrl.password || configuredUrl.search || configuredUrl.hash || configuredUrl.pathname !== '/') {
  throw new Error('SITE_URL deve essere un dominio HTTPS completo, senza percorsi, credenziali o parametri.')
}
export const SITE_URL = configuredUrl.origin
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export const SOCIAL_IMAGE = '/images/eos-social-v1.png'
export const SITE_TITLE = 'EOS | Ingegneria e progettazione integrata'
export const SITE_DESCRIPTION = 'Progettazione civile, ambiente e sicurezza. EOS integra competenze di ingegneria e progettazione, con uffici a Milano, Roma e Trieste.'

export const PAGE_SEO = {
  '/': {title:SITE_TITLE,description:SITE_DESCRIPTION,index:true},
  '/about': {title:'Progettazione integrata | EOS',description:'Le competenze EOS: architettura, strutture, impianti, sicurezza e coordinamento. Discipline diverse per accompagnare ogni fase del progetto.',index:true},
  '/portfolio': {title:'Portfolio e progetti | EOS',description:'Esplora il portfolio EOS, i progetti in evidenza e le competenze che contribuiscono a trasformare idee ed esigenze in soluzioni concrete.',index:true},
  '/studio': {title:'Ufficio e team | EOS',description:'Conosci il team EOS: persone, competenze e collaborazione al servizio della progettazione integrata, a Milano, Roma e Trieste.',index:true},
  '/jobs': {title:'Lavora con noi | EOS',description:'Scopri le posizioni aperte in EOS e le opportunità per entrare nel team. Presenta il tuo profilo per una posizione o con una candidatura spontanea.',index:true},
  '/contatti': {title:'Contatti e sedi | EOS',description:'Contatta EOS e trova le indicazioni per raggiungere gli uffici di Milano, Roma e Trieste. Inizia il confronto sul tuo prossimo progetto.',index:true},
  '/privacy-policy': {title:'Privacy policy | EOS',description:'Informativa privacy del sito EOS. Il documento definitivo è in preparazione.',index:false},
  '/cookie-policy': {title:'Cookie policy | EOS',description:'Informativa sui cookie del sito EOS. Il documento definitivo è in preparazione.',index:false},
} satisfies Record<string,{title:string;description:string;index:boolean}>
export type SeoPath = keyof typeof PAGE_SEO

export function pageMetadata(path:SeoPath):Metadata {
  const page = PAGE_SEO[path]
  return {
    title:page.title,
    description:page.description,
    alternates:{canonical:path},
    robots:{index:page.index && !IS_PREVIEW,follow:!IS_PREVIEW},
    openGraph:{
      type:'website',locale:'it_IT',siteName:'EOS',url:path,
      title:page.title,description:page.description,
      images:[{url:SOCIAL_IMAGE,width:1200,height:630,alt:'EOS — Competenze diverse. Un progetto integrato. Milano, Roma e Trieste.'}],
    },
    twitter:{card:'summary_large_image',title:page.title,description:page.description,images:[SOCIAL_IMAGE]},
  }
}
