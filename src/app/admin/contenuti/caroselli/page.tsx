import Link from 'next/link'
import { GalleryAdminPage } from '../about/GalleryAdminPage'
export default function CaroselliPage(){
 return <div className="min-h-screen"><header className="glass border-b border-white/50 sticky top-0 z-10"><nav className="max-w-6xl mx-auto px-6 h-14 flex gap-2 items-center text-sm" aria-label="Percorso"><Link href="/admin">Dashboard</Link><span aria-hidden="true">/</span><Link href="/admin/contenuti">Contenuti</Link><span aria-hidden="true">/</span><span>Modifica caroselli</span></nav></header>
 <main className="max-w-6xl mx-auto px-6 py-10"><h1 className="text-2xl font-bold text-ink">Modifica caroselli</h1><p className="text-sm text-muted mt-2 mb-6">Gestisci da qui le fotografie delle pagine About e Studio. Ogni carosello ha il proprio salvataggio.</p><nav className="flex gap-3 mb-10" aria-label="Seleziona carosello"><a className="team-order-save" href="#about">About</a><a className="team-order-save" href="#studio">Studio</a></nav><GalleryAdminPage galleryKey="about" embedded/><GalleryAdminPage galleryKey="studio" embedded/></main></div>
}
