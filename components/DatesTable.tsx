import Link from 'next/link'
import type { SessionDate } from '@/lib/types'
import { formatDate } from '@/lib/types'

interface Props {
  dates: SessionDate[]
}

export default function DatesTable({ dates }: Props) {
  if (dates.length === 0) {
    return (
      <p style={{ padding: '2rem 0', color: 'var(--on-surface-variant)' }}>
        Sin sesiones disponibles en este momento — vuelve pronto.
      </p>
    )
  }

  return (
    <table className="dates-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Sesión</th>
          <th>Disponibilidad</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {dates.map((d) => {
          const soldOut = d.spots_left === 0
          const pct = Math.round(((d.spots_total - d.spots_left) / d.spots_total) * 100)

          return (
            <tr key={d.id} className="dates-row">
              <td>
                <strong style={{ fontFamily: 'var(--font-serif)' }}>
                  {formatDate(d.date)}
                </strong>
              </td>
              <td style={{ color: 'var(--on-surface-variant)' }}>{d.time}</td>
              <td>
                <span className="tag-pill">{d.session_name}</span>
              </td>
              <td>
                <div className="spots-bar">
                  <div
                    className={`spots-bar-fill${soldOut ? ' full' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className={`spots-text${soldOut ? ' sold-out' : ''}`}>
                  {soldOut
                    ? 'Completo'
                    : `${d.spots_left} plaza${d.spots_left !== 1 ? 's' : ''} disponible${d.spots_left !== 1 ? 's' : ''}`}
                </div>
              </td>
              <td>
                {soldOut ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--outline)' }}>
                    Completo
                  </span>
                ) : (
                  <Link href={d.book_url || '/reservar'} className="btn-primary btn-sm">
                    Reservar →
                  </Link>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
