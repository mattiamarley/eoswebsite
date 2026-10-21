'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Props = {
  title: string
  closeHref: string
  children: ReactNode
}

export function Modal({ title, closeHref, children }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      {/* Backdrop: blur immediato, senza animazione opacity che ritarda il filtro */}
      <Link
        href={closeHref}
        aria-label="Chiudi"
        className="fixed inset-0 backdrop-blur-md bg-white/10"
      />

      {/* Card: entra con animazione */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg my-4 sm:my-8 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <Link
            href={closeHref}
            aria-label="Chiudi"
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:bg-lavender-light hover:text-lavender-dark transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Link>
        </div>
        <div className="px-6 py-5">{children}</div>
      </motion.div>
    </div>
  )
}
