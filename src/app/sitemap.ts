import type { MetadataRoute } from 'next'
import { PAGE_SEO, SITE_URL } from '@/src/lib/site-seo'

export default function sitemap():MetadataRoute.Sitemap {
  return Object.entries(PAGE_SEO)
    .filter(([,page])=>page.index)
    .map(([path])=>({url:new URL(path,SITE_URL).href}))
}
