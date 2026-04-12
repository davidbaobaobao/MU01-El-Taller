import Image from 'next/image'
import Link from 'next/link'
import type { CatalogItem } from '@/lib/types'

interface Props {
  item: CatalogItem
}

const CATEGORY_FALLBACK: Record<string, string> = {
  Individual:  '/media/session-classic.jpeg',
  Grupo:       '/media/session-group.jpeg',
  Parejas:     '/media/session-date.jpeg',
  Corporativo: '/media/session-corporate.jpeg',
}

export default function SessionCard({ item }: Props) {
  const isFeatured = item.featured ?? false
  const priceDisplay =
    item.price === null || item.price_label === 'POA'
      ? 'Consultar'
      : `€${item.price}`
  const priceNote = item.price_label ?? ''
  const btnText = item.price === null || item.price_label === 'POA' ? 'Consultar' : 'Reservar sesión'
  const bookHref = item.price === null || item.price_label === 'POA' ? '/contacto?subject=corporate' : '/reservar'

  return (
    <div className={`session-card${isFeatured ? ' featured' : ''}`}>
      <div className="session-card-image-wrap">
        {(() => {
          const src = item.image_url || CATEGORY_FALLBACK[item.category] || null
          return src ? (
            <Image
              src={src}
              alt={item.name}
              fill
              className="session-card-image"
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--surface-container)' }} />
          )
        })()}
        {isFeatured && (
          <span className="session-card-badge">Más popular</span>
        )}
      </div>

      <div className="session-card-body">
        <span className="session-card-tag">{item.category}</span>
        <h3 className="session-card-title">{item.name}</h3>
        <p className="session-card-desc">{item.description}</p>

        <div className="session-card-price">
          {priceDisplay}{' '}
          <span>{priceNote}</span>
        </div>

        <Link
          href={bookHref}
          className={`session-card-btn ${isFeatured ? 'on-primary' : 'on-surface'}`}
        >
          {btnText}
        </Link>
      </div>
    </div>
  )
}
