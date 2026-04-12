'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const subjects = [
  { value: 'general', label: 'Pregunta general' },
  { value: 'corporate', label: 'Taller corporativo' },
  { value: 'gift-classic', label: 'Bono regalo — El Clásico' },
  { value: 'gift-group', label: 'Bono regalo — Sesión en Grupo' },
  { value: 'gift-date', label: 'Bono regalo — Noche de Pareja' },
  { value: 'gift-custom', label: 'Bono regalo — Importe personalizado' },
  { value: 'press', label: 'Prensa' },
]

export default function ContactForm() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams?.get('subject')
  const [submitted, setSubmitted] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (subjectParam && selectRef.current) {
      const opts = Array.from(selectRef.current.options)
      const opt = opts.find((o) => o.value === subjectParam)
      if (opt) opt.selected = true
    }
  }, [subjectParam])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to Resend API route — POST /api/contact
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p
        style={{
          padding: '2rem',
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--secondary)',
          lineHeight: 1.7,
        }}
      >
        Gracias — nos pondremos en contacto en menos de un día hábil.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="c-name">Tu nombre</label>
          <input className="form-input" id="c-name" name="name" type="text" placeholder="Clara Martín" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="c-email">Correo electrónico</label>
          <input className="form-input" id="c-email" name="email" type="email" placeholder="hola@tu.com" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-subject">Asunto</label>
        <select className="form-select" id="c-subject" name="subject" ref={selectRef}>
          {subjects.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-message">Mensaje</label>
        <textarea
          className="form-textarea"
          id="c-message"
          name="message"
          placeholder="Cuéntanos qué necesitas..."
          required
        />
      </div>

      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
        Enviar mensaje →
      </button>
    </form>
  )
}
