import Link from 'next/link'
import { OFFICES, OFFICE_PHONE } from '@/src/lib/offices'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#091a45' }} className="text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-20 pt-12 md:pt-16 pb-8 md:pb-12">

        <div className="footer-overview">
          <span className="footer-logo leading-none select-none" style={{fontFamily:'Arial, sans-serif',fontSize:'clamp(56px, 8vw, 80px)',letterSpacing:'-2px'}}>eos</span>
          <div className="footer-company">
            <p className="font-bold leading-tight mb-4 text-base md:text-[20px]">Eos s.r.l.<br/>Progettazione civile,<br/>ambiente e sicurezza</p>
            <div className="text-white/70 text-sm md:text-base leading-relaxed">
              <p><a href="mailto:eos@eosweb.it">eos@eosweb.it</a></p>
              <p>C.F. 12266450159</p>
              <p><a href={OFFICE_PHONE.href}>{OFFICE_PHONE.label}</a></p>
            </div>
          </div>
          <div className="footer-offices">{OFFICES.map(office=><div key={office.city}>
            <p className="font-bold leading-tight mb-3 text-base md:text-[20px]">{office.city}</p>
            <div className="text-white/70 text-sm md:text-base leading-relaxed">
              <p>{office.address}</p><p>{office.postalCode} {office.city} - Italia</p>
              <p><a href={OFFICE_PHONE.href}>{OFFICE_PHONE.label}</a></p>
            </div>
          </div>)}</div>
        </div>

        {/* Divisore */}
        <div className="mt-10 md:mt-14 mb-5 md:mb-6 border-t border-white/10" />

        {/* Riga bottom */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-white/70 text-sm" style={{ letterSpacing: '-0.28px' }}>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie policy</Link>
          </div>
          <p>© {new Date().getFullYear()} EOS srl</p>
          <a
            href="https://www.linkedin.com/company/eos-srl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Linkedin
          </a>
        </div>

      </div>
    </footer>
  )
}
