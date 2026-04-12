'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const sessionOptions = [
  { value: '', label: 'Elige una sesión…' },
  { value: 'el-clasico', label: 'El Clásico — €45/persona (2 h, individual)' },
  { value: 'sesion-grupo', label: 'Sesión en Grupo — €35/persona (2,5 h, 4–12 personas)' },
  { value: 'noche-pareja', label: 'Noche de Pareja — €85/pareja (2,5 h, parejas)' },
  { value: 'corporativo', label: 'Taller Corporativo — consultar precio' },
]

const timeOptions = [
  { value: '', label: 'Cualquier hora' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '19:00', label: '19:00' },
]

export default function BookingForm() {
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [sessionVal, setSessionVal] = useState('')
  const [dateVal, setDateVal] = useState('')
  const [timeVal, setTimeVal] = useState('')

  useEffect(() => {
    const session = searchParams?.get('session')
    const date = searchParams?.get('date')
    const time = searchParams?.get('time')

    if (session) {
      // map old slug keys to new
      const map: Record<string, string> = {
        'the-classic': 'el-clasico',
        'group-session': 'sesion-grupo',
        'date-night': 'noche-pareja',
        'corporate': 'corporativo',
      }
      setSessionVal(map[session] ?? session)
    }
    if (date) setDateVal(date)
    if (time) setTimeVal(time.replace(/(\d{2})(\d{2})/, '$1:$2'))

    // Set min date to today
    const today = new Date().toISOString().split('T')[0]
    const dateInput = document.getElementById('booking-date') as HTMLInputElement | null
    if (dateInput) dateInput.min = today
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to Resend API route — POST /api/reservar
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '2rem',
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          ¡Solicitud enviada!
        </p>
        <p style={{ color: 'var(--secondary)', lineHeight: 1.7 }}>
          Confirmaremos tu reserva por correo electrónico en unas pocas horas.
        </p>
      </div>
    )
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-name">Nombre completo</label>
          <input className="form-input" id="booking-name" name="name" type="text" placeholder="Clara Martín" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-email">Correo electrónico</label>
          <input className="form-input" id="booking-email" name="email" type="email" placeholder="hola@tu.com" required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-phone">Teléfono (opcional)</label>
          <input className="form-input" id="booking-phone" name="phone" type="tel" placeholder="+34 600 000 000" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-people">Número de personas</label>
          <input className="form-input" id="booking-people" name="people" type="number" min="1" max="20" defaultValue={1} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="booking-session">Tipo de sesión</label>
        <select
          className="form-select"
          id="booking-session"
          name="session"
          value={sessionVal}
          onChange={(e) => setSessionVal(e.target.value)}
        >
          {sessionOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-date">Fecha preferida</label>
          <input
            className="form-input"
            id="booking-date"
            name="date"
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="booking-time">Hora preferida</label>
          <select
            className="form-select"
            id="booking-time"
            name="time"
            value={timeVal}
            onChange={(e) => setTimeVal(e.target.value)}
          >
            {timeOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="booking-notes">¿Algo que debamos saber?</label>
        <textarea
          className="form-textarea"
          id="booking-notes"
          name="notes"
          placeholder="Alergias, necesidades de accesibilidad, ocasión especial, referencia de bono regalo…"
        />
      </div>

      <div
        style={{
          background: 'var(--surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', lineHeight: 1.7 }}>
          Al enviar este formulario estás solicitando una reserva. Te enviaremos un correo de
          confirmación una vez que hayamos comprobado la disponibilidad. No se realiza ningún
          pago hasta la confirmación. Las cancelaciones dentro de las 48 horas previas a la
          sesión no son reembolsables.
        </p>
      </div>

      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        Solicitar reserva →
      </button>
    </form>
  )
}
