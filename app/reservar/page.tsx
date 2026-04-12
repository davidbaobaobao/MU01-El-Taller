import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DatesCards from '@/components/DatesCards'
import BookingForm from './BookingForm'
import { supabase } from '@/lib/supabase'
import type { SessionDate } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Reservar una sesión',
  description:
    'Reserva tu sesión de cerámica en El Taller, Gràcia, Barcelona.',
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

export default async function ReservarPage() {
  const dates = await getUpcomingDates()

  return (
    <>
      <Nav />
      <main style={{ paddingBottom: '6rem' }}>
        <section style={{ padding: '3rem 1.5rem 6rem' }}>
          <div className="container" style={{ maxWidth: '52rem' }}>

            <div style={{ marginBottom: '3rem' }}>
              <p className="section-label">Reserva tu plaza</p>
              <h1 className="section-heading">Reservar una sesión</h1>
              <p style={{ color: 'var(--secondary)', marginTop: '1rem', lineHeight: 1.7 }}>
                Rellena tus datos a continuación. Confirmaremos tu reserva por correo electrónico
                en unas pocas horas. El pago se realiza el día de la sesión salvo que reserves
                una sesión grupal (se requiere un depósito del 50%).
              </p>
            </div>

            {/* Booking form — needs useSearchParams so wrapped in Suspense */}
            <Suspense fallback={null}>
              <BookingForm />
            </Suspense>

            {/* Upcoming dates */}
            {dates.length > 0 && (
              <div
                style={{
                  marginTop: '4rem',
                  paddingTop: '4rem',
                  borderTop: '1px solid rgba(218,193,184,.2)',
                }}
              >
                <p className="section-label">Fechas disponibles</p>
                <h2 className="section-heading" style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
                  Próximas sesiones
                </h2>
                <DatesCards dates={dates} />
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
