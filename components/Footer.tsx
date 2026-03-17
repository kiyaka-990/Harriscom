'use client'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--navy-dark)', color: 'white' }}>
      {/* Brand stripe */}
      <div className="brand-stripe" style={{ height: 4 }} />

      <div style={{ padding: '5rem 5% 2rem', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.2rem' }}>
              <div style={{
                width: 42, height: 42,
                background: 'var(--navy-light)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,.1)',
              }}>
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>H</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '.04em', lineHeight: 1 }}>HARRISCOM</div>
                <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.5)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Company Limited</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.88rem', lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem', fontWeight: 300 }}>
              Construction & General Supplies — Building Kenya's future, one project at a time. Registered · Reliable · Results-driven.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '.7rem' }}>
              {['fb', 'ig', 'li', 'wa'].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,.5)',
                    textDecoration: 'none',
                    fontSize: '.75rem',
                    fontWeight: 600,
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--amber)'
                    e.currentTarget.style.color = 'var(--amber)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'
                    e.currentTarget.style.color = 'rgba(255,255,255,.5)'
                  }}
                >
                  {s.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--amber)', fontWeight: 600, marginBottom: '1.4rem' }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {['Building Construction', 'Renovations & Fit-Out', 'General Supplies', 'Electrical & Plumbing', 'Interior Design', 'Project Management'].map(s => (
                <li key={s}>
                  <a href="#services" style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', fontSize: '.85rem', transition: 'color .2s', fontWeight: 300 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--amber)', fontWeight: 600, marginBottom: '1.4rem' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {[['#about','About Us'],['#portfolio','Our Projects'],['#process','Our Process'],['#contact','Contact Us']].map(([href,label]) => (
                <li key={label}>
                  <a href={href} style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', fontSize: '.85rem', transition: 'color .2s', fontWeight: 300 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--amber)', fontWeight: 600, marginBottom: '1.4rem' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              {[
                { icon: '📞', val: '+254 728 392 225' },
                { icon: '✉️', val: 'mdjaafar2225@gmail.com' },
                { icon: '📍', val: '12th Floor, Bruce House\nStandard Street, Nairobi' },
              ].map(c => (
                <div key={c.icon} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '.9rem', marginTop: 1 }}>{c.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,.55)', fontSize: '.83rem', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 300 }}>{c.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
            © {year} Harriscom Company Limited · Reg. No. PVT-6LUK5LZD
          </span>
          <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
            Built with <span style={{ color: 'var(--crimson)' }}>♥</span> by Asterleigh Systems
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}
