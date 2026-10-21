import { requireAdmin } from '@/src/utils/supabase/admin'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin()
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #ddd9f5 0%, #edeaf9 25%, #f4f5fa 55%, #e8eaf5 80%, #d6d2f0 100%)' }}>
      {/* Blob decorativi */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '-10%', left: '-8%',
          width: '55vw', height: '55vw', maxWidth: 700, maxHeight: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181,175,226,0.45) 0%, rgba(181,175,226,0.15) 50%, transparent 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '-12%',
          width: '45vw', height: '45vw', maxWidth: 580, maxHeight: 580,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,43,94,0.10) 0%, rgba(26,43,94,0.04) 50%, transparent 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '20%',
          width: '50vw', height: '50vw', maxWidth: 640, maxHeight: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181,175,226,0.30) 0%, rgba(216,213,241,0.15) 50%, transparent 70%)',
          filter: 'blur(2px)',
        }} />
      </div>

      {/* Contenuto */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}
