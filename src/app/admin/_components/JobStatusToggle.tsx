'use client'

import { useTransition } from 'react'

type Props = {
  id: string
  isOpen: boolean
  action: (id: string, currentStatus: boolean) => Promise<void>
}

export function JobStatusToggle({ id, isOpen, action }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={isOpen}
        aria-label={isOpen ? 'Posizione aperta — clicca per chiudere' : 'Posizione chiusa — clicca per riaprire'}
        disabled={pending}
        onClick={() => startTransition(async () => { await action(id, isOpen) })}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lavender disabled:opacity-60 ${
          isOpen ? 'bg-lavender' : 'bg-haze'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            isOpen ? 'translate-x-5' : 'translate-x-0.5'
          } ${pending ? 'animate-pulse' : ''}`}
        />
      </button>
      <span className={`text-xs font-medium ${isOpen ? 'text-lavender-dark' : 'text-muted'}`}>
        {pending ? '…' : isOpen ? 'Aperta' : 'Chiusa'}
      </span>
    </div>
  )
}
