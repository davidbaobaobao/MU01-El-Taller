import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SessionGrid from '@/components/SessionGrid'
import DatesTable from '@/components/DatesTable'
import ScrollVideoSection from '@/components/ScrollVideoSection'
import ScrollReveal from '@/components/ScrollReveal'
import HeroVideo from '@/components/HeroVideo'
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
        <section
          style={{
            position: 'relative',
            height: '100vh',
            minHeight: '600px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background video — seamless JS loop */}
          <HeroVideo />

          {/* Dark gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(30,27,21,0.75) 0%, rgba(30,27,21,0.35) 50%, rgba(30,27,21,0.15) 100%)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              padding: '0 1.5rem',
              maxWidth: '52rem',
            }}
          >
            <p
              className="section-label"
              style={{ color: 'rgba(255,220,195,0.85)', marginBottom: '1.5rem' }}
            >
              Gràcia, Barcelona
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--surface)',
                marginBottom: '1.5rem',
              }}
            >
              Haz algo<br />
              con tus <em style={{ color: 'rgba(220,160,120,1)' }}>manos.</em>
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'rgba(255,248,242,0.75)',
                maxWidth: '30rem',
                margin: '0 auto 2.25rem',
                lineHeight: 1.7,
              }}
            >
              Pasa tus tardes en nuestro estudio lleno de luz en Gràcia.
              Sin experiencia previa — solo ganas de mancharte un poco.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/reservar" className="btn-primary">Reservar una sesión →</Link>
              <Link href="/regalo" className="btn-ghost" style={{ color: 'var(--surface)', borderColor: 'rgba(255,248,242,0.4)' }}>
                Regalar una clase
              </Link>
            </div>
          </div>
        </section>

        {/* ── SCROLL VIDEO ── */}
        <ScrollVideoSection />

        {/* ── SESSIONS (dynamic) ── */}
        {sessions.length > 0 && (
          <section className="bg-low py-24">
            <div className="container">
              <ScrollReveal>
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
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <SessionGrid sessions={sessions} />
              </ScrollReveal>

              <ScrollReveal delay={200} style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link href="/talleres" className="btn-ghost">Ver todos los talleres</Link>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── UPCOMING DATES (dynamic) ── */}
        {dates.length > 0 && (
          <section className="py-24">
            <div className="container">
              <ScrollReveal>
                <div style={{ marginBottom: '2.5rem' }}>
                  <p className="section-label">Disponibilidad</p>
                  <h2 className="section-heading">Próximas sesiones</h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <DatesTable dates={dates} />
              </ScrollReveal>
              <ScrollReveal delay={180} style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href="/talleres" className="btn-ghost">Ver todas las fechas</Link>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── STUDIO MOMENTS ── */}
        <section className="py-24 bg-low">
          <div className="container">
            <ScrollReveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="section-label">Ambiente</p>
              <h2 className="section-heading">Momentos del estudio</h2>
            </ScrollReveal>

            {/* Row 1 — 2 images, offset */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '5fr 1fr 6fr',
                gap: '1.25rem',
                maxWidth: '68rem',
                margin: '0 auto 1.25rem',
                alignItems: 'start',
              }}
            >
              <ScrollReveal delay={0}>
                <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '999px 999px 40% 40%', overflow: 'hidden', transform: 'rotate(-1.5deg)', marginTop: '3rem' }}>
                  <Image src="/media/gallery1.jpeg" alt="Taller de cerámica" fill style={{ objectFit: 'cover' }} sizes="30vw" />
                </div>
              </ScrollReveal>
              <div /> {/* spacer */}
              <ScrollReveal delay={80}>
                <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: '40% 40% 999px 999px', overflow: 'hidden', transform: 'rotate(1deg)' }}>
                  <Image src="/media/gallery2.jpeg" alt="Piezas de cerámica" fill style={{ objectFit: 'cover' }} sizes="35vw" />
                </div>
              </ScrollReveal>
            </div>

            {/* Row 2 — 3 images */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1fr',
                gap: '1.25rem',
                maxWidth: '68rem',
                margin: '0 auto 1.25rem',
                alignItems: 'end',
              }}
            >
              <ScrollReveal delay={60}>
                <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '50% 30% 50% 30%', overflow: 'hidden', transform: 'rotate(2deg)', marginTop: '1rem' }}>
                  <Image src="/media/gallery3.jpeg" alt="Arcilla y textura" fill style={{ objectFit: 'cover' }} sizes="22vw" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={140}>
                <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '30% 50% 30% 50%', overflow: 'hidden', transform: 'rotate(-1deg)' }}>
                  <Image src="/media/studio-1.jpeg" alt="Estudio de cerámica" fill style={{ objectFit: 'cover' }} sizes="28vw" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={220}>
                <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', transform: 'rotate(1.5deg)', marginTop: '2rem' }}>
                  <Image src="/media/gallery4.jpeg" alt="Cuencos artesanales" fill style={{ objectFit: 'cover' }} sizes="22vw" />
                </div>
              </ScrollReveal>
            </div>

            {/* Row 3 — 3 images */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1.2fr',
                gap: '1.25rem',
                maxWidth: '68rem',
                margin: '0 auto',
                alignItems: 'start',
              }}
            >
              <ScrollReveal delay={80}>
                <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '40% 30% 50% 40%', overflow: 'hidden', transform: 'rotate(-0.5deg)' }}>
                  <Image src="/media/studio-2.jpeg" alt="Interior del estudio" fill style={{ objectFit: 'cover' }} sizes="28vw" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: '999px', overflow: 'hidden', transform: 'rotate(1deg)', marginTop: '-2rem' }}>
                  <Image src="/media/gallery5.jpeg" alt="Proceso creativo" fill style={{ objectFit: 'cover' }} sizes="22vw" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={240}>
                <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '30% 50% 30% 50%', overflow: 'hidden', transform: 'rotate(-1.5deg)' }}>
                  <Image src="/media/studio-3.jpeg" alt="Herramientas del alfarero" fill style={{ objectFit: 'cover' }} sizes="28vw" />
                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24">
          <div className="container">
            <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            </ScrollReveal>
            <div className="grid-4">
              {[
                { n: '1', title: 'Reservar', desc: 'Elige tu sesión y horario online. Pago al confirmar.', delay: 0 },
                { n: '2', title: 'Aparecer', desc: 'Encuéntranos en Carrer de la Perla, Gràcia. Delantal y materiales esperando.', delay: 100 },
                { n: '3', title: 'Crear', desc: 'Moldea, da forma y refina tu creación con nuestra instructora.', delay: 200 },
                { n: '4', title: 'Recoger', desc: 'Lo cocemos y vidriamos. Tu pieza estará lista para recoger en dos semanas.', delay: 300 },
              ].map(({ n, title, desc, delay }) => (
                <ScrollReveal key={n} delay={delay}>
                  <div className="step" style={{ textAlign: 'center' }}>
                    <div className="step-circle">{n}</div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: 1.6, padding: '0 1rem' }}>
                      {desc}
                    </p>
                  </div>
                </ScrollReveal>
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
            <ScrollReveal>
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
            </ScrollReveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
