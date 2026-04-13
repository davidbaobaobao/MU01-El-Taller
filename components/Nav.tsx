'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',         label: 'Inicio' },
  { href: '/talleres', label: 'Talleres' },
  { href: '/estudio',  label: 'El Estudio' },
  { href: '/regalo',   label: 'Regalar una clase' },
  { href: '/contacto', label: 'Encuéntranos' },
  { href: '/reservar', label: 'Reservar sesión' },
]

export default function Nav() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef   = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav className="nav" ref={menuRef}>

        {/* ── Hamburger — mobile only ── */}
        <button
          className="nav-hamburger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? (
            /* X icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="17" y2="6"  />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>

        {/* ── Logo ── */}
        <Link href="/" className="nav-logo">
          El Taller
        </Link>

        {/* ── Desktop links ── */}
        <div className="nav-links">
          {links.slice(0, 5).map(({ href, label }) => (
            <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <Link href="/reservar" className="nav-cta">
          Reservar sesión
        </Link>

        {/* ── Mobile dropdown ── */}
        <div className={`mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`mobile-menu-link${isActive(href) ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

      </nav>
    </>
  )
}
