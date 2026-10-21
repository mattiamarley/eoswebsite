import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#091a45' }} className="text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-20 pt-12 md:pt-16 pb-8 md:pb-12">

        {/* Griglia principale */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[260px_1fr_1fr_1fr] md:gap-8">

          {/* Logo — occupa tutta la larghezza su mobile */}
          <div className="col-span-2 md:col-span-1 flex items-end">
            <span
              className="leading-none select-none"
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: 'clamp(56px, 14vw, 96px)',
                letterSpacing: '-2px',
                color: 'white',
              }}
            >
              eos
            </span>
          </div>

          {/* Info azienda — occupa tutta la larghezza su mobile */}
          <div className="col-span-2 md:col-span-1">
            <p
              className="font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', letterSpacing: '-0.4px' }}
            >
              Eos s.r.l.<br />
              Progettazione civile,<br />
              ambiente e sicurezza
            </p>
            <div className="text-white/70 space-y-0.5 text-sm md:text-base" style={{ lineHeight: '23px', letterSpacing: '-0.28px' }}>
              <p><a href="mailto:eos@eosweb.it">eos@eosweb.it</a></p>
              <p>C.F. 12266450159</p>
              <p><a href="tel:+39022666092">T +39 022666092</a></p>
            </div>
          </div>

          {/* Milano */}
          <div>
            <p className="font-bold mb-3 text-base md:text-[20px]" style={{ letterSpacing: '-0.4px' }}>
              Milano
            </p>
            <div className="text-white/70 space-y-0.5 text-sm md:text-base" style={{ lineHeight: '23px', letterSpacing: '-0.28px' }}>
              <p>Via Nicola Antonio Porpora, 98</p>
              <p>20131 Milano - Italia</p>
              <p><a href="tel:+39022666092">T +39 022666092</a></p>
            </div>
          </div>

          {/* Roma */}
          <div>
            <p className="font-bold mb-3 text-base md:text-[20px]" style={{ letterSpacing: '-0.4px' }}>
              Roma
            </p>
            <div className="text-white/70 space-y-0.5 text-sm md:text-base" style={{ lineHeight: '23px', letterSpacing: '-0.28px' }}>
              <p>Via dei Laterani, 36</p>
              <p>00184 Roma - Italia</p>
              <p><a href="tel:+39022666092">T +39 022666092</a></p>
            </div>
          </div>
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
