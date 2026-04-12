import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SessionGrid from '@/components/SessionGrid'
import DatesTable from '@/components/DatesTable'
import { supabase } from '@/lib/supabase'
import type { CatalogItem, SessionDate } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Talleres',
  description:
    'Explora todos los talleres de cerámica en El Taller, Gràcia. Sesiones individuales, grupales, en pareja y corporativas.',
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

export default async function TalleresPage() {
  const [sessions, dates] = await Promise.all([getSessions(), getUpcomingDates()])

  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>

        {/* ── PAGE HEADER ── */}
        <section style={{ padding: '4rem 1.5rem 3rem', background: 'var(--surface-container-low)' }}>
          <div className="container">
            <p className="section-label">Lo que ofrecemos</p>
            <h1 className="section-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              Encuentra tu sesión
            </h1>
            <p style={{ color: 'var(--secondary)', marginTop: '1rem', maxWidth: '36rem', lineHeight: 1.7 }}>
              Todas las sesiones incluyen materiales, una instructora con experiencia y un rato
              genuinamente bueno en nuestro estudio de Gràcia. Sin experiencia previa necesaria.
            </p>
          </div>
        </section>

        {/* ── SESSION CARDS (dynamic, filterable) ── */}
        <section className="py-24">
          <div className="container">
            <SessionGrid sessions={sessions} showFilter />
          </div>
        </section>

        {/* ── UPCOMING DATES (dynamic, full list) ── */}
        <section className="py-24 bg-low">
          <div className="container">
            <div style={{ marginBottom: '2.5rem' }}>
              <p className="section-label">Reserva una plaza</p>
              <h2 className="section-heading">Próximas sesiones</h2>
              <p style={{ color: 'var(--secondary)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
                Las plazas se llenan rápido, especialmente los fines de semana. Reserva con antelación.
              </p>
            </div>
            <DatesTable dates={dates} />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24">
          <div className="container" style={{ maxWidth: '48rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <p className="section-label">Antes de venir</p>
              <h2 className="section-heading">Preguntas frecuentes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                {
                  q: '¿Necesito experiencia previa?',
                  a: 'Para nada. Nuestras sesiones están diseñadas para principiantes absolutos. Nuestras instructoras te guían paso a paso — solo tienes que aparecer.',
                },
                {
                  q: '¿Qué ropa debo llevar?',
                  a: 'Algo que no te importe manchar. Proporcionamos delantales, pero las mangas y la ropa clara van a su propio riesgo. Se recomiendan zapatos cerrados.',
                },
                {
                  q: '¿Cuándo recibo mi pieza?',
                  a: 'Las piezas se cuecen y vidrian en las dos semanas siguientes a tu sesión. Te avisaremos por correo cuando estén listas para recoger en el estudio.',
                },
                {
                  q: '¿Puedo cancelar o cambiar la fecha?',
                  a: 'Sí — hasta 48 horas antes de tu sesión para un reembolso completo. Dentro de las 48 horas, podemos reagendarte a una fecha futura pero no reembolsar. Escríbenos para gestionarlo.',
                },
              ].map(({ q, a }, i, arr) => (
                <details
                  key={q}
                  style={{
                    borderTop: '1px solid rgba(218,193,184,.3)',
                    borderBottom: i === arr.length - 1 ? '1px solid rgba(218,193,184,.3)' : 'none',
                    padding: '1.5rem 0',
                  }}
                >
                  <summary
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {q}
                    <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-body)', fontSize: '1.25rem', lineHeight: 1 }}>
                      +
                    </span>
                  </summary>
                  <p style={{ color: 'var(--secondary)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '0 1.5rem 4rem' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Link href="/reservar" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1.1rem 2.5rem' }}>
              Reservar tu sesión →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
