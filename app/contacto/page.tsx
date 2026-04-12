import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Encuéntranos',
  description:
    'El Taller está en Carrer de la Perla, 12, en Gràcia, Barcelona. Ven a visitarnos o mándanos un mensaje.',
}

export default function ContactoPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>

        {/* ── HEADER ── */}
        <section style={{ padding: '4rem 1.5rem 3rem', background: 'var(--surface-container-low)' }}>
          <div className="container">
            <p className="section-label">Ven a visitarnos</p>
            <h1 className="section-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              Encuéntranos
            </h1>
            <p style={{ color: 'var(--secondary)', marginTop: '1rem', maxWidth: '32rem', lineHeight: 1.7 }}>
              Estamos en Carrer de la Perla, en el corazón de Gràcia. A cinco minutos a pie
              de la estación de metro Fontana.
            </p>
          </div>
        </section>

        {/* ── MAP + INFO ── */}
        <section className="py-24">
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                alignItems: 'start',
              }}
            >
              {/* Map */}
              <div className="map-container">
                {/* Placeholder: replace src with real Google Maps embed URL before launch */}
                <iframe
                  title="Mapa de El Taller"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.153%2C41.399%2C2.163%2C41.406&layer=mapnik&marker=41.4024%2C2.1573"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Info */}
              <div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Dirección
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      lineHeight: 1.7,
                      color: 'var(--on-surface)',
                    }}
                  >
                    Carrer de la Perla, 12<br />
                    08012 Barcelona<br />
                    Gràcia
                  </p>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Cómo llegar
                  </p>
                  <ul style={{ color: 'var(--secondary)', lineHeight: 2, fontSize: '0.95rem', listStyle: 'none', padding: 0 }}>
                    <li>Metro: Fontana (L3) — 5 min caminando</li>
                    <li>Autobús: V17, 22, 24 — parada Gràcia</li>
                    <li>Bici: Estación Bicing en Plaça de la Vila de Gràcia</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Horario del estudio
                  </p>
                  <ul style={{ color: 'var(--secondary)', lineHeight: 2, fontSize: '0.95rem', listStyle: 'none', padding: 0 }}>
                    <li>Lunes – Viernes: 10:00 – 21:00</li>
                    <li>Sábados: 10:00 – 20:00</li>
                    <li>Domingos: Cerrado</li>
                  </ul>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Contacto
                  </p>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', lineHeight: 2 }}>
                    <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      hola@eltaller.barcelona
                    </a>
                    <br />
                    <a href="tel:+34931234567" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      +34 93 123 45 67
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT FORM ── */}
        <section className="py-24 bg-low">
          <div className="container" style={{ maxWidth: '44rem' }}>
            <p className="section-label">Escríbenos</p>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>Mándanos un mensaje</h2>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
