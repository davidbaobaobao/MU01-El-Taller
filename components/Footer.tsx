import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-logo">El Taller</div>
        <p className="footer-address">
          Carrer de la Perla, 12, Gràcia<br />
          Barcelona 08012<br />
          <a href="mailto:hola@eltaller.barcelona" style={{ color: 'var(--primary)' }}>
            hola@eltaller.barcelona
          </a>
        </p>
      </div>

      <nav className="footer-links">
        <Link href="/talleres">Talleres</Link>
        <Link href="/estudio">El Estudio</Link>
        <Link href="/regalo">Regalar una clase</Link>
        <Link href="/contacto">Encuéntranos</Link>
        <Link href="/reservar">Reservar ahora</Link>
      </nav>

      <div>
        <p className="footer-copy">
          © 2025 El Taller Barcelona. Hecho a mano en Gràcia.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
          <Link
            href="/aviso-legal"
            style={{ fontSize: '0.6rem', color: 'var(--secondary)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Aviso legal
          </Link>
          <Link
            href="/privacidad"
            style={{ fontSize: '0.6rem', color: 'var(--secondary)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Privacidad
          </Link>
          <Link
            href="/cookies"
            style={{ fontSize: '0.6rem', color: 'var(--secondary)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}
