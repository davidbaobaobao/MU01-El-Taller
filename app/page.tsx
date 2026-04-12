import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SessionGrid from '@/components/SessionGrid'
import DatesTable from '@/components/DatesTable'
import { supabase } from '@/lib/supabase'
import type { CatalogItem, SessionDate } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'El Taller — Estudio de Cerámica Barcelona',
  description:
    'Talleres de cerámica por la tarde en el corazón de Gràcia, Barcelona. Para grupos, parejas y artistas en solitario. Sin experiencia previa.',
}

async function getSessions(): Promise<CatalogItem[]> {
  const { data } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!)
    .eq('available', true)
    .order('sort_order', { ascending: true })
  return (data as CatalogItem[]) || []
}

async function getUpcomingDates(): Promise<SessionDate[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('sessions_dates')
    .select('*')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!)
    .eq('active', true)
    .gte('date', today)
    .order('date', { ascending: true })
  return (data as SessionDate[]) || []
}

export default async function HomePage() {
  const [allSessions, allDates] = await Promise.all([getSessions(), getUpcomingDates()])
  const sessions = allSessions.slice(0, 3)
  const dates = allDates.slice(0, 5)

  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>

        {/* ── HERO ── */}
        <section style={{ padding: '3rem 1.5rem 5rem', maxWidth: '80rem', margin: '0 auto', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>

            <div style={{ zIndex: 1 }}>
              <p className="section-label">Gràcia, Barcelona</p>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(3rem, 7vw, 5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'var(--on-surface)',
                  marginBottom: '1.5rem',
                }}
              >
                Haz algo<br />
                con tus <em style={{ color: 'var(--primary)' }}>manos.</em>
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--secondary)',
                  maxWidth: '28rem',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                }}
              >
                Pasa tus tardes en nuestro estudio lleno de luz en Gràcia.
                Sin experiencia previa — solo ganas de mancharte un poco.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="/reservar" className="btn-primary">Reservar una sesión →</Link>
                <Link href="/regalo" className="btn-ghost">Regalar una clase</Link>
              </div>
            </div>

            {/* Asymmetric image collage */}
            <div style={{ position: 'relative', height: '480px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '72%',
                  height: '75%',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transform: 'rotate(2deg)',
                }}
              >
                <Image
                  src="/media/hero-wheel.jpeg"
                  alt="Manos moldeando arcilla en un torno de alfarería"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="50vw"
                  priority
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: 0,
                  width: '60%',
                  height: '50%',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transform: 'rotate(-3deg)',
                  border: '8px solid var(--surface)',
                  zIndex: 2,
                }}
              >
                <Image
                  src="/media/hero-mugs.jpeg"
                  alt="Tazas de cerámica hechas a mano en una estantería de madera"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="40vw"
                  priority
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── SESSIONS (dynamic) ── */}
        {sessions.length > 0 && (
          <section className="bg-low py-24">
            <div className="container">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '3rem',
                }}
              >
                <div>
                  <p className="section-label">Talleres</p>
                  <h2 className="section-heading">Elige tu tarde</h2>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--secondary)',
                    maxWidth: '18rem',
                    textAlign: 'right',
                    opacity: 0.7,
                    fontSize: '0.95rem',
                  }}
                >
                  &ldquo;Cada pieza cuenta la historia de las manos que la sostuvieron.&rdquo;
                </p>
              </div>

              <SessionGrid sessions={sessions} />

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link href="/talleres" className="btn-ghost">Ver todos los talleres</Link>
              </div>
            </div>
          </section>
        )}

        {/* ── UPCOMING DATES (dynamic) ── */}
        {dates.length > 0 && (
          <section className="py-24">
            <div className="container">
              <div style={{ marginBottom: '2.5rem' }}>
                <p className="section-label">Disponibilidad</p>
                <h2 className="section-heading">Próximas sesiones</h2>
              </div>
              <DatesTable dates={dates} />
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href="/talleres" className="btn-ghost">Ver todas las fechas</Link>
              </div>
            </div>
          </section>
        )}

        {/* ── STUDIO MOMENTS ── */}
        <section className="py-24 bg-low">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="section-label">Ambiente</p>
              <h2 className="section-heading">Momentos del estudio</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                maxWidth: '60rem',
                margin: '0 auto',
              }}
            >
              {[
                { src: '/media/studio-1.jpeg', alt: 'Texturas de arcilla en primer plano', rotate: '-2deg', ratio: '1 / 1', bg: 'var(--surface-container)' },
                { src: '/media/studio-2.jpeg', alt: 'Cuencos terminados en una estantería', rotate: '1deg', ratio: '4 / 5', bg: 'var(--surface-container-high)' },
                { src: '/media/studio-3.jpeg', alt: 'Interior del estudio con luz solar', rotate: '2deg', ratio: '4 / 3', bg: 'var(--surface-container)' },
                { src: '/media/studio-4.jpeg', alt: 'Herramientas del alfarero ordenadas', rotate: '-1deg', ratio: '1 / 1', bg: 'var(--surface-container-high)' },
              ].map(({ src, alt, rotate, ratio, bg }) => (
                <div
                  key={src}
                  style={{
                    aspectRatio: ratio,
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    transform: `rotate(${rotate})`,
                    background: bg,
                    position: 'relative',
                  }}
                >
                  <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="30vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="section-heading">El viaje de una pieza</h2>
              <div
                style={{
                  width: '4rem',
                  height: '3px',
                  background: 'rgba(144,72,36,.2)',
                  borderRadius: '9999px',
                  margin: '1rem auto 0',
                }}
              />
            </div>
            <div className="grid-4">
              {[
                {
                  n: '1',
                  title: 'Reservar',
                  desc: 'Elige tu sesión y horario online. Pago al confirmar.',
                },
                {
                  n: '2',
                  title: 'Aparecer',
                  desc: 'Encuéntranos en Carrer de la Perla, Gràcia. Delantal y materiales esperando.',
                },
                {
                  n: '3',
                  title: 'Crear',
                  desc: 'Moldea, da forma y refina tu creación con nuestra instructora.',
                },
                {
                  n: '4',
                  title: 'Recoger',
                  desc: 'Lo cocemos y vidriamos. Tu pieza estará lista para recoger en dos semanas.',
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="step" style={{ textAlign: 'center' }}>
                  <div className="step-circle">{n}</div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: 1.6, padding: '0 1rem' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEW MARQUEE ── */}
        <section
          style={{
            borderTop: '1px solid rgba(218,193,184,.2)',
            borderBottom: '1px solid rgba(218,193,184,.2)',
            padding: '3.5rem 0',
            background: 'var(--surface-container-lowest)',
            overflow: 'hidden',
          }}
        >
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[
                { quote: '&ldquo;La escapada perfecta del ruido digital.&rdquo;', author: '— Marc R.' },
                { quote: '&ldquo;La joya creativa escondida de Gràcia.&rdquo;', author: '— Elena S.' },
                { quote: '&ldquo;Las manos sucias, el alma limpia.&rdquo;', author: '— Jordi V.' },
                { quote: '&ldquo;La mejor noche romántica de Barcelona.&rdquo;', author: '— Sofia L.' },
              ].flatMap((r, i, arr) => [
                <div key={`a-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexShrink: 0 }}>
                  <p
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic' }}
                    dangerouslySetInnerHTML={{ __html: r.quote }}
                  />
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                    }}
                  >
                    {r.author}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: 'rgba(144,72,36,.2)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>,
              ])}
              {/* Duplicate for seamless loop */}
              {[
                { quote: '&ldquo;La escapada perfecta del ruido digital.&rdquo;', author: '— Marc R.' },
                { quote: '&ldquo;La joya creativa escondida de Gràcia.&rdquo;', author: '— Elena S.' },
                { quote: '&ldquo;Las manos sucias, el alma limpia.&rdquo;', author: '— Jordi V.' },
                { quote: '&ldquo;La mejor noche romántica de Barcelona.&rdquo;', author: '— Sofia L.' },
              ].flatMap((r, i, arr) => [
                <div key={`b-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexShrink: 0 }}>
                  <p
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic' }}
                    dangerouslySetInnerHTML={{ __html: r.quote }}
                  />
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--secondary)',
                    }}
                  >
                    {r.author}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: 'rgba(144,72,36,.2)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>,
              ])}
            </div>
          </div>
        </section>

        {/* ── DARK CTA ── */}
        <section style={{ padding: '4rem 1.5rem' }}>
          <div className="container">
            <div className="cta-dark">
              <h2>¿Listo para mancharte<br />las manos?</h2>
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
