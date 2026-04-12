import Link from 'next/link'
import type { SessionDate } from '@/lib/types'
import { formatDate } from '@/lib/types'

interface Props {
  dates: SessionDate[]
}

export default function DatesCards({ dates }: Props) {
  if (dates.length === 0) {
    return (
      <p style={{ padding: '2rem 0', color: 'var(--on-surface-variant)' }}>
        Sin sesiones disponibles en este momento — vuelve pronto.
      </p>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}
    >
      {dates.map((d) => {
        const soldOut = d.spots_left === 0

        return (
          <div
            key={d.id}
            style={{
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              borderBottom: `3px solid ${soldOut ? 'var(--outline)' : 'var(--primary)'}`,
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--secondary)',
                marginBottom: '0.5rem',
              }}
            >
              {d.session_name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                marginBottom: '0.25rem',
              }}
            >
              {formatDate(d.date)}
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--on-surface-variant)',
                marginBottom: '1rem',
              }}
            >
              {d.time}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: soldOut ? 'var(--error)' : 'var(--on-surface-variant)',
                marginBottom: '1rem',
              }}
            >
              {soldOut
                ? 'Completo'
                : `${d.spots_left} de ${d.spots_total} plazas disponibles`}
            </div>
            {!soldOut && (
              <Link
                href={d.book_url || '/reservar'}
                className="btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex' }}
              >
                Reservar →
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
