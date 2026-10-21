'use client'

import { useRef, useState } from 'react'
import { compressImage } from './compressImage'

type Props = {
  name: string
  multiple?: boolean
  className?: string
}

export function ImageInput({ name, multiple, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) {
      setStatus(null)
      return
    }

    setStatus('Ottimizzazione in corso…')
    const compressed = await Promise.all(files.map(compressImage))

    // Sostituiamo i file selezionati con quelli compressi: l'assegnazione
    // programmatica di .files NON ri-scatena l'evento change.
    const dataTransfer = new DataTransfer()
    compressed.forEach((file) => dataTransfer.items.add(file))
    if (inputRef.current) inputRef.current.files = dataTransfer.files

    const totalMb = compressed.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024
    setStatus(
      `${compressed.length} ${compressed.length === 1 ? 'immagine pronta' : 'immagini pronte'} · ${totalMb.toFixed(1)} MB`
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        className={className}
      />
      {status && <p className="mt-1.5 text-xs text-gray-400">{status}</p>}
    </div>
  )
}
