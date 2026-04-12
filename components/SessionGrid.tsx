'use client'

import { useState } from 'react'
import SessionCard from './SessionCard'
import type { CatalogItem } from '@/lib/types'

interface Props {
  sessions: CatalogItem[]
  showFilter?: boolean
}

export default function SessionGrid({ sessions, showFilter = false }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const categories = ['Individual', 'Grupo', 'Parejas', 'Corporativo']
  const displayed = activeFilter
    ? sessions.filter((s) => s.category === activeFilter)
    : sessions

  if (sessions.length === 0) return null

  return (
    <div>
      {showFilter && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button
            className={`filter-btn${activeFilter === null ? ' active' : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid-3">
        {displayed.map((item) => (
          <SessionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
