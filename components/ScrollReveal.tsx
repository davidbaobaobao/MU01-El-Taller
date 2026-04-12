'use client'

import { useEffect, useRef, ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  delay?: number        // ms stagger delay
  distance?: number     // px translateY start
  style?: CSSProperties
  className?: string
}

/**
 * Wraps children in an element that fades + rises into view
 * the first time it enters the viewport (IntersectionObserver).
 */
export default function ScrollReveal({
  children,
  delay = 0,
  distance = 28,
  style,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Start hidden
    el.style.opacity = '0'
    el.style.transform = `translateY(${distance}px)`
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)

    return () => obs.disconnect()
  }, [delay, distance])

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
