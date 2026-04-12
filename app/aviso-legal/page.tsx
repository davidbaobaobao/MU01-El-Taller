import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Aviso Legal',
}

export default function AvisoLegalPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>
        <section style={{ padding: '4rem 1.5rem 3rem', background: 'var(--surface-container-low)' }}>
          <div className="container" style={{ maxWidth: '48rem' }}>
            <p className="section-label">Legal</p>
            <h1 className="section-heading">Aviso Legal</h1>
          </div>
        </section>
        <section className="py-24">
          <div className="container" style={{ maxWidth: '48rem' }}>
            <div style={{ lineHeight: 1.8, color: 'var(--secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  1. Datos identificativos
                </h2>
                <p>
                  En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
                  de la Sociedad de la Información y del Comercio Electrónico, se informa que el
                  titular de este sitio web es <strong>El Taller Barcelona</strong>, con domicilio
                  en Carrer de la Perla, 12, 08012 Barcelona.
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  Correo de contacto:{' '}
                  <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)' }}>
                    hola@eltaller.barcelona
                  </a>
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  2. Condiciones de uso
                </h2>
                <p>
                  El acceso y uso de este sitio web implica la aceptación de las presentes condiciones.
                  El Taller Barcelona se reserva el derecho a modificar, en cualquier momento,
                  la presentación y configuración del sitio web.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  3. Propiedad intelectual
                </h2>
                <p>
                  Todos los contenidos del sitio web (textos, fotografías, gráficos, imágenes,
                  tecnología, software, y demás contenidos audiovisuales o sonoros) son propiedad
                  de El Taller Barcelona o de sus licenciantes, y están protegidos por las leyes
                  de propiedad intelectual e industrial.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  4. Limitación de responsabilidad
                </h2>
                <p>
                  El Taller Barcelona no se responsabiliza de los daños o perjuicios de cualquier
                  naturaleza que pudieran ocasionarse por la utilización de los servicios y
                  contenidos de la página web.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  5. Legislación aplicable
                </h2>
                <p>
                  Las presentes condiciones se rigen por la legislación española. Para la resolución
                  de cualquier controversia derivada de este aviso legal, las partes se someten
                  a los juzgados y tribunales de Barcelona.
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
