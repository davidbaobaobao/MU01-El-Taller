'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-driven video section.
 *
 * Desktop layout:
 * - 550vh outer container → 450vh of available scroll (sticky panel is 100vh).
 * - Video displayed centred at ~40 % of viewport width so the animation
 *   content is clearly framed, not edge-to-edge.
 * - Smooth cubic ease-out applied to raw scroll progress.
 * - Video scrubs over the first 50 % of eased progress, then holds.
 * - Text reveals staggered from 55 %–85 %.
 * - Final 50 % of scroll = pure linger (≈225vh) — the last frame sits
 *   on screen for a long, unhurried pause before the next section.
 *
 * Mobile: static poster image + IntersectionObserver text fade-in.
 */

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)   // cubic ease-out
}

export default function ScrollVideoSection() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headRef  = useRef<HTMLHeadingElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches)
  }, [])

  // ── Desktop: scroll-driven scrub ─────────────────────────────────
  useEffect(() => {
    if (isMobile) return

    const wrap  = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    let raf = 0

    const textEls: Array<{ el: HTMLElement; start: number; end: number }> = []
    if (labelRef.current) textEls.push({ el: labelRef.current, start: 0.55, end: 0.70 })
    if (headRef.current)  textEls.push({ el: headRef.current,  start: 0.63, end: 0.78 })
    if (quoteRef.current) textEls.push({ el: quoteRef.current, start: 0.71, end: 0.87 })

    const tick = () => {
      const rect        = wrap.getBoundingClientRect()
      const totalScroll = wrap.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return

      const rawP = Math.min(1, Math.max(0, -rect.top) / totalScroll)
      const p    = easeOut(rawP)

      // Video plays over first 50 % of eased progress, then holds on last frame
      const vp = Math.min(1, p / 0.50)
      if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
        video.currentTime = vp * video.duration
      }

      // Text fade + rise
      textEls.forEach(({ el, start, end }) => {
        const tp = Math.max(0, Math.min(1, (p - start) / (end - start)))
        el.style.opacity   = String(tp)
        el.style.transform = `translateY(${(1 - tp) * 22}px)`
      })
    }

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [isMobile])

  // ── Mobile: IntersectionObserver text reveal ──────────────────────
  useEffect(() => {
    if (!isMobile) return

    const items = [
      { el: labelRef.current, delay: 0 },
      { el: headRef.current,  delay: 150 },
      { el: quoteRef.current, delay: 300 },
    ]

    const wrap = wrapRef.current
    if (!wrap) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        items.forEach(({ el, delay }) => {
          if (!el) return
          el.style.transition = `opacity 0.85s ease ${delay}ms, transform 0.85s ease ${delay}ms`
          el.style.opacity    = '1'
          el.style.transform  = 'translateY(0)'
        })
        obs.disconnect()
      },
      { threshold: 0.25 }
    )
    obs.observe(wrap)

    return () => obs.disconnect()
  }, [isMobile])

  return (
    <div
      ref={wrapRef}
      style={{ height: isMobile ? '100vh' : '550vh', position: 'relative' }}
    >
      {/* Sticky viewport-height panel */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff8f2' }}>

        {/* ── Desktop video — centred, ~40 % width ── */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(50vw, 816px)',
              aspectRatio: '16 / 10',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(100,70,50,0.12)',
            }}
          >
            <video
              ref={videoRef}
              src="/media/slider-2.mp4"
              muted
              playsInline
              preload="auto"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* ── Mobile: static image ── */}
        {isMobile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/media/studio-hero.jpeg"
            alt=""
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Bottom gradient for text legibility */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(255,248,242,0.96) 0%, rgba(255,248,242,0.5) 35%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: 0,
            right: 0,
            padding: '0 2rem',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <p
            ref={labelRef}
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#54433c',
              background: 'rgba(30,27,21,0.07)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '1.25rem',
              opacity: 0,
              willChange: 'opacity, transform',
              transform: 'translateY(22px)',
            }}
          >
            Talleres
          </p>

          <h2
            ref={headRef}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#1e1b15',
              marginBottom: '1.25rem',
              opacity: 0,
              willChange: 'opacity, transform',
              transform: 'translateY(22px)',
            }}
          >
            Elige tu tarde
          </h2>

          <p
            ref={quoteRef}
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#54433c',
              maxWidth: '32rem',
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: 0,
              willChange: 'opacity, transform',
              transform: 'translateY(22px)',
            }}
          >
            &ldquo;Cada pieza cuenta la historia de las manos que la sostuvieron.&rdquo;
          </p>
        </div>

      </div>
    </div>
  )
}
