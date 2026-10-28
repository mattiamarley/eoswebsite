import { AdminHeader } from '@/src/app/admin/_components/AdminHeader'
import Link from 'next/link'
import { GalleryAdminPage } from '../about/GalleryAdminPage'
export default function CaroselliPage(){
 return <div className="min-h-screen"><AdminHeader backHref="/admin/contenuti"><Link href="/admin">Dashboard</Link><span aria-hidden="true">/</span><Link href="/admin/contenuti">Contenuti</Link><span aria-hidden="true">/</span><span>Modifica caroselli</span></AdminHeader>
 <main className="max-w-6xl mx-auto px-6 py-10"><h1 className="text-2xl font-bold text-ink">Modifica caroselli</h1><p className="text-sm text-muted mt-2 mb-6">Gestisci da qui le fotografie delle pagine About e Ufficio. Ogni carosello ha il proprio salvataggio.</p><nav className="flex gap-3 mb-10" aria-label="Seleziona carosello"><a className="team-order-save" href="#about">About</a><a className="team-order-save" href="#studio">Ufficio</a></nav><GalleryAdminPage galleryKey="about" embedded/><GalleryAdminPage galleryKey="studio" embedded/></main></div>
}
