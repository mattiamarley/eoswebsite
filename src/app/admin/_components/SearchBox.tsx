'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  action: string
  defaultValue?: string
  placeholder?: string
  hidden?: Record<string, string | undefined>
}

export function SearchBox({ action, defaultValue = '', placeholder = 'Cerca…', hidden }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function buildUrl(value: string) {
    const params = new URLSearchParams()
    const q = value.trim()
    if (q) params.set('q', q)
    if (hidden) {
      for (const [key, val] of Object.entries(hidden)) {
        if (val) params.set(key, val)
      }
    }
    const qs = params.toString()
    return `${action}${qs ? `?${qs}` : ''}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(buildUrl(inputRef.current?.value ?? ''))
  }

  function clearSearch() {
    if (inputRef.current) inputRef.current.value = ''
    router.push(buildUrl(''))
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm text-ink placeholder-muted bg-white/60 backdrop-blur-sm border border-white/50 rounded-full outline-none transition focus:ring-2 focus:ring-lavender focus:border-transparent shadow-soft"
        />
      </form>

      {defaultValue && (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-lavender-light border border-lavender/20 text-xs text-ink">
            <span className="text-lavender-dark">Ricerca:</span>
            <span className="font-semibold">{defaultValue}</span>
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Cancella ricerca"
              className="w-4 h-4 flex items-center justify-center rounded-full text-lavender-dark hover:bg-lavender hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      )}
    </div>
  )
}
