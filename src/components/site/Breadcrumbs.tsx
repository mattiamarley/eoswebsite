import Link from 'next/link'

export function Breadcrumbs({current}: {current:string}) {
  return <nav className="eyebrow mb-6" aria-label="Percorso">
    <ol className="flex items-center gap-2">
      <li><Link href="/" className="hover:underline">EOS</Link></li>
      <li aria-hidden="true">/</li>
      <li aria-current="page">{current}</li>
    </ol>
  </nav>
}
