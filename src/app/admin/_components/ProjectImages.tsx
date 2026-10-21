'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { compressImage } from './compressImage'

type NewFile = { id: string; file: File; preview: string }

type Props = {
  /** URL delle immagini già salvate sul progetto (modalità modifica). */
  initialImages?: string[]
  labelClassName?: string
}

/**
 * Gestione della galleria di un progetto:
 * - mostra le immagini esistenti con un pulsante per rimuoverle singolarmente
 * - permette di aggiungere nuovi file (compressi nel browser) con anteprima
 *
 * Le immagini mantenute vengono inviate alla Server Action come campi nascosti
 * `existing_images`, i nuovi file tramite l'input `images`.
 */
export function ProjectImages({ initialImages = [], labelClassName = 'block text-sm font-medium text-gray-700' }: Props) {
  const [existing, setExisting] = useState<string[]>(initialImages)
  const [newFiles, setNewFiles] = useState<NewFile[]>([])
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizza i File compressi nell'input reale che verrà inviato col form.
  function syncFileInput(items: NewFile[]) {
    const dataTransfer = new DataTransfer()
    items.forEach(({ file }) => dataTransfer.items.add(file))
    if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files
  }

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (picked.length === 0) return

    setBusy(true)
    try {
      const compressed = await Promise.all(picked.map(compressImage))
      const added: NewFile[] = compressed.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }))
      const next = [...newFiles, ...added]
      setNewFiles(next)
      syncFileInput(next)
    } finally {
      setBusy(false)
      e.target.value = '' // consente di riselezionare lo stesso file
    }
  }

  function removeExisting(url: string) {
    setExisting((prev) => prev.filter((u) => u !== url))
  }

  function removeNew(id: string) {
    setNewFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      const next = prev.filter((f) => f.id !== id)
      syncFileInput(next)
      return next
    })
  }

  const total = existing.length + newFiles.length

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelClassName}>Immagini</label>
        {total > 0 && <span className="text-xs text-gray-400">{total} selezionate</span>}
      </div>

      {total > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {existing.map((url) => (
            <Thumbnail key={url} src={url} onRemove={() => removeExisting(url)} />
          ))}
          {newFiles.map((f) => (
            <Thumbnail key={f.id} src={f.preview} badge="Nuova" onRemove={() => removeNew(f.id)} />
          ))}
        </div>
      )}

      {/* URL mantenuti → inviati alla Server Action */}
      {existing.map((url) => (
        <input key={url} type="hidden" name="existing_images" value={url} />
      ))}

      {/* Input reale con i file compressi (impostato via DataTransfer) */}
      <input ref={fileInputRef} name="images" type="file" accept="image/*" multiple className="hidden" tabIndex={-1} />

      {/* Selettore visibile */}
      <label className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Aggiungi immagini
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleSelect} />
      </label>
      {busy && <span className="ml-2 text-xs text-gray-400">Ottimizzazione…</span>}
    </div>
  )
}

function Thumbnail({
  src,
  onRemove,
  badge,
}: {
  src: string
  onRemove: () => void
  badge?: string
}) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
      <Image src={src} alt="" fill unoptimized sizes="120px" className="object-cover" />
      {badge && (
        <span className="absolute left-1 top-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-900/80 text-white">
          {badge}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Rimuovi immagine"
        className="absolute right-1 top-1 w-6 h-6 flex items-center justify-center rounded-full bg-gray-900/70 text-white hover:bg-red-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
