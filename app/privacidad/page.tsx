import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
}

export default function PrivacidadPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>
        <section style={{ padding: '4rem 1.5rem 3rem', background: 'var(--surface-container-low)' }}>
          <div className="container" style={{ maxWidth: '48rem' }}>
            <p className="section-label">Legal</p>
            <h1 className="section-heading">Política de Privacidad</h1>
          </div>
        </section>
        <section className="py-24">
          <div className="container" style={{ maxWidth: '48rem' }}>
            <div style={{ lineHeight: 1.8, color: 'var(--secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  1. Responsable del tratamiento
                </h2>
                <p>
                  <strong>El Taller Barcelona</strong> — Carrer de la Perla, 12, 08012 Barcelona<br />
                  Contacto:{' '}
                  <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)' }}>
                    hola@eltaller.barcelona
                  </a>
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  2. Datos que recopilamos
                </h2>
                <p>
                  Recopilamos los datos que nos proporcionas voluntariamente al rellenar nuestros
                  formularios de contacto y reserva: nombre, correo electrónico, teléfono y
                  preferencias de sesión. No recopilamos datos de pago directamente.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  3. Finalidad del tratamiento
                </h2>
                <p>
                  Tus datos se utilizan exclusivamente para gestionar reservas, responder consultas
                  y enviarte información relacionada con tu sesión. No cedemos tus datos a terceros
                  salvo obligación legal.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  4. Conservación de datos
                </h2>
                <p>
                  Conservamos tus datos durante el tiempo necesario para la prestación del servicio
                  y, posteriormente, durante los plazos legalmente establecidos.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  5. Tus derechos
                </h2>
                <p>
                  Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación,
                  portabilidad y oposición enviando un correo a{' '}
                  <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)' }}>
                    hola@eltaller.barcelona
                  </a>
                  . También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
                </p>
              </div>
            </div>
            <div style={{ marginTop: '3rem' }}>
              <Link href="/" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
