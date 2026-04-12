import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Regalar una clase',
  description:
    'Regala el placer de crear. Bonos regalo de El Taller para cualquier sesión — válidos 12 meses.',
}

export default function RegaloPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>

        {/* ── HERO ── */}
        <section style={{ padding: '4rem 1.5rem', background: 'var(--surface-container-low)' }}>
          <div className="container" style={{ maxWidth: '56rem' }}>
            <p className="section-label">Para alguien especial</p>
            <h1 className="section-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              Regala el placer de <em style={{ color: 'var(--primary)' }}>crear</em>
            </h1>
            <p style={{ color: 'var(--secondary)', marginTop: '1.5rem', lineHeight: 1.8, fontSize: '1rem', maxWidth: '36rem' }}>
              Bonos regalo para cualquier sesión de El Taller. Elige el tipo, enviamos un bono
              de diseño impecable por correo — imprimible o reenviable directamente. Válido 12 meses.
            </p>
          </div>
        </section>

        {/* ── HOW GIFTING WORKS ── */}
        <section className="py-24">
          <div className="container" style={{ maxWidth: '56rem' }}>
            <p className="section-label">Cómo funciona</p>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>Así de sencillo</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                {
                  n: '1',
                  title: 'Elige un tipo de sesión',
                  desc: 'Escoge entre El Clásico, Sesión en Grupo, Noche de Pareja o un bono de valor libre que pueden canjear por cualquier cosa.',
                },
                {
                  n: '2',
                  title: 'Rellena los detalles',
                  desc: 'Añade tu nombre, el del destinatario y un mensaje personal. Personalizamos cada bono.',
                },
                {
                  n: '3',
                  title: 'Enviamos el bono',
                  desc: 'Recibes un PDF por correo — reenvíalo, imprímelo o entrégalo como prefieras.',
                },
                {
                  n: '4',
                  title: 'Ellos reservan su plaza',
                  desc: 'El destinatario usa el código del bono para reservar cualquier sesión disponible. Válido 12 meses desde la compra.',
                },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'var(--on-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {n}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                      {title}
                    </h3>
                    <p style={{ color: 'var(--secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIFT OPTIONS ── */}
        <section className="py-24 bg-low">
          <div className="container">
            <p className="section-label">Opciones</p>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>Elige un bono</h2>
            <div className="grid-3">

              {/* Classic */}
              <div
                style={{
                  background: 'var(--surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  borderBottom: '3px solid var(--outline-variant)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--secondary)',
                    marginBottom: '1rem',
                  }}
                >
                  Individual
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  El Clásico
                </h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Una sesión individual de 2 horas en el torno. Perfecto para alguien que siempre ha
                  querido intentarlo.
                </p>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  €45
                </div>
                <Link
                  href="/contacto?subject=gift-classic"
                  className="session-card-btn on-surface"
                >
                  Comprar bono
                </Link>
              </div>

              {/* Group — featured */}
              <div
                style={{
                  background: 'var(--primary)',
                  color: 'var(--on-primary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  transform: 'scale(1.03)',
                  boxShadow: '0 20px 60px rgba(144,72,36,.25)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: '1rem',
                  }}
                >
                  Mejor regalo · Grupo
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  Sesión en Grupo
                </h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Para un cumpleaños, despedida de soltera o un grupo de amigos. Desde €35 por persona.
                </p>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  Desde €35<span style={{ fontSize: '0.9rem', fontWeight: 400, opacity: 0.6 }}>/pp</span>
                </div>
                <Link
                  href="/contacto?subject=gift-group"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    color: 'var(--primary)',
                  }}
                >
                  Comprar bono
                </Link>
              </div>

              {/* Date Night */}
              <div
                style={{
                  background: 'var(--surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  borderBottom: '3px solid var(--outline-variant)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--secondary)',
                    marginBottom: '1rem',
                  }}
                >
                  Parejas
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  Noche de Pareja
                </h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Tiempo compartido en el torno para dos. Una velada genuinamente romántica — arcilla incluida.
                </p>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                  €85
                </div>
                <Link
                  href="/contacto?subject=gift-date"
                  className="session-card-btn on-surface"
                >
                  Comprar bono
                </Link>
              </div>

            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>
              ¿Quieres un importe personalizado?{' '}
              <Link href="/contacto?subject=gift-custom" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Escríbenos →
              </Link>
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
