import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Cookies',
}

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>
        <section style={{ padding: '4rem 1.5rem 3rem', background: 'var(--surface-container-low)' }}>
          <div className="container" style={{ maxWidth: '48rem' }}>
            <p className="section-label">Legal</p>
            <h1 className="section-heading">Política de Cookies</h1>
          </div>
        </section>
        <section className="py-24">
          <div className="container" style={{ maxWidth: '48rem' }}>
            <div style={{ lineHeight: 1.8, color: 'var(--secondary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  ¿Qué son las cookies?
                </h2>
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
                  dispositivo. Se utilizan para que el sitio funcione correctamente y para
                  ofrecerte una experiencia personalizada.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  Cookies que utilizamos
                </h2>
                <p>
                  Este sitio web utiliza únicamente cookies técnicas estrictamente necesarias para
                  su funcionamiento. No utilizamos cookies de seguimiento ni publicitarias de
                  terceros.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  Cómo desactivar las cookies
                </h2>
                <p>
                  Puedes configurar tu navegador para rechazar las cookies o para que te avise
                  cuando se envíen. Ten en cuenta que algunas funcionalidades del sitio pueden
                  verse afectadas si desactivas las cookies.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>
                  Más información
                </h2>
                <p>
                  Para cualquier consulta sobre nuestra política de cookies, puedes contactarnos
                  en{' '}
                  <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)' }}>
                    hola@eltaller.barcelona
                  </a>
                  .
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
