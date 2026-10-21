import type { ReactNode } from 'react'
import { Navbar } from '@/src/components/Navbar'
import { Footer } from '@/src/components/Footer'
import { BackToTop } from '@/src/components/site/BackToTop'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </div>
    </>
  )
}
