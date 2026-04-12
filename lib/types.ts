export interface CatalogItem {
  id: string
  client_id: string
  name: string
  description: string
  price: number | null
  price_label: string | null
  category: string // 'Individual' | 'Grupo' | 'Parejas' | 'Corporativo'
  image_url: string | null
  available: boolean
  sort_order: number
  featured?: boolean
}

export interface SessionDate {
  id: string
  client_id: string
  session_name: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  spots_total: number
  spots_left: number
  book_url: string
  active: boolean
}

// Minimal Database type for createClient generic
export interface Database {
  public: {
    Tables: {
      catalog_items: {
        Row: CatalogItem
      }
      sessions_dates: {
        Row: SessionDate
      }
    }
  }
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
}

export function formatPrice(item: CatalogItem): string {
  if (item.price === null || item.price_label === 'POA') return 'POA'
  return `€${item.price}`
}
