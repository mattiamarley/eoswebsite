import type { MetadataRoute } from 'next'
import { IS_PREVIEW, SITE_URL } from '@/src/lib/site-seo'

export default function robots():MetadataRoute.Robots {
  if(IS_PREVIEW)return {rules:{userAgent:'*',disallow:'/'}}
  return {
    rules:{userAgent:'*',allow:'/',disallow:['/admin','/login']},
    sitemap:`${SITE_URL}/sitemap.xml`,
  }
}
