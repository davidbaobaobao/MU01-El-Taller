'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/talleres', label: 'Talleres' },
  { href: '/estudio', label: 'El Estudio' },
  { href: '/regalo', label: 'Regalar una clase' },
  { href: '/contacto', label: 'Encuéntranos' },
]

export default function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          El Taller
        </Link>

        <div className="nav-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link href="/reservar" className="nav-cta">
          Reservar sesión
        </Link>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <Link
          href="/reservar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            borderRadius: '9999px',
            padding: '0.5rem 1.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Reservar
          </span>
        </Link>
        <Link
          href="/contacto"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'var(--secondary)',
            padding: '0.5rem 1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Encuéntranos
          </span>
        </Link>
      </nav>
    </>
  )
}
