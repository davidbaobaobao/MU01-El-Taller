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

    </>
  )
}
