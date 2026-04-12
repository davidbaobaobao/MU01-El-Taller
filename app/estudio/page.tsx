import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'El Estudio',
  description:
    'Conoce El Taller — nuestra historia, nuestro estudio en Gràcia y las personas detrás del torno.',
}

export default function EstudioPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>

        {/* ── HERO ── */}
        <section style={{ padding: '4rem 1.5rem', background: 'var(--surface-container-low)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <p className="section-label">Nuestra historia</p>
              <h1 className="section-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                Un estudio construido<br />en la <em style={{ color: 'var(--primary)' }}>creación lenta</em>
              </h1>
              <p style={{ color: 'var(--secondary)', marginTop: '1.5rem', lineHeight: 1.8, maxWidth: '38rem', fontSize: '1rem' }}>
                El Taller empezó en 2019 con un solo torno y un horno prestado en el fondo de un
                espacio compartido en Carrer de la Perla. Lo que comenzó como una obsesión personal
                se convirtió, poco a poco, en un lugar donde el barrio venía a hacer cosas con las manos.
              </p>
              <p style={{ color: 'var(--secondary)', marginTop: '1rem', lineHeight: 1.8, maxWidth: '38rem', fontSize: '1rem' }}>
                Creemos en la satisfacción particular de sostener algo que has hecho tú mismo.
                Imperfecto, táctil, tuyo.
              </p>
            </div>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                height: '420px',
                background: 'var(--surface-container)',
                position: 'relative',
              }}
            >
              <Image
                src="/media/studio-hero.jpeg"
                alt="Interior del estudio El Taller en Gràcia"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: '4rem 1.5rem', borderBottom: '1px solid rgba(218,193,184,.2)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
              {[
                { num: '4.200+', label: 'tazas hechas' },
                { num: '6', label: 'tornos' },
                { num: '4.9', label: 'valoración en Google' },
                { num: '2019', label: 'año de fundación' },
              ].map(({ num, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '3rem',
                      color: 'var(--primary)',
                      lineHeight: 1,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                      opacity: 0.7,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE SPACE ── */}
        <section className="py-24">
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                alignItems: 'center',
              }}
            >
              <div>
                <p className="section-label">El espacio</p>
                <h2 className="section-heading">Un auténtico estudio de Gràcia</h2>
                <p style={{ color: 'var(--secondary)', marginTop: '1.5rem', lineHeight: 1.8 }}>
                  200 metros cuadrados de espacio de trabajo luminoso en la planta baja de un edificio
                  de los años 20. Seis tornos, dos hornos, una larga mesa comunal para modelado a mano
                  y una barra de cocina donde vive el vino.
                </p>
                <p style={{ color: 'var(--secondary)', marginTop: '1rem', lineHeight: 1.8 }}>
                  El estudio huele a arcilla y café. Normalmente hay música — no demasiado alta.
                  Estarás en casa antes de que oscurezca.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                  style={{
                    aspectRatio: '3 / 4',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    background: 'var(--surface-container)',
                    transform: 'rotate(-1deg)',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/media/studio-space-1.jpeg"
                    alt="Tornos de alfarería en el estudio"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="20vw"
                  />
                </div>
                <div
                  style={{
                    aspectRatio: '3 / 4',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    background: 'var(--surface-container-high)',
                    transform: 'rotate(2deg)',
                    marginTop: '2rem',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/media/studio-space-2.jpeg"
                    alt="Horno y piezas terminadas"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="20vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTRUCTOR ── */}
        <section className="py-24 bg-low">
          <div className="container" style={{ maxWidth: '56rem' }}>
            <p className="section-label">El equipo</p>
            <h2 className="section-heading" style={{ marginBottom: '3rem' }}>Con quién trabajarás</h2>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  overflow: 'hidden',
                  background: 'var(--surface-container)',
                  position: 'relative',
                }}
              >
                <Image
                  src="/media/instructor.jpeg"
                  alt="Marta Solà, instructora"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="160px"
                />
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  Marta Solà
                </h3>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--secondary)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Fundadora e Instructora Principal
                </p>
                <p style={{ color: 'var(--secondary)', lineHeight: 1.8 }}>
                  Marta se formó en la Escola Massana de Barcelona y pasó tres años en un colectivo
                  de estudios en Kyoto antes de volver para abrir El Taller. Imparte cada sesión
                  ella misma junto a un pequeño equipo de instructoras que ella misma ha formado.
                  Espera feedback directo, mucha paciencia y muy buenas listas de reproducción.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '4rem 1.5rem' }}>
          <div className="container">
            <div className="cta-dark">
              <h2>Ven a hacer algo.</h2>
              <Link
                href="/reservar"
                className="btn-primary"
                style={{ fontSize: '1.1rem', padding: '1.1rem 2.5rem' }}
              >
                Reservar tu sesión →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
