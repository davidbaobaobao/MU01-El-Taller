'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll-driven video section.
 *
 * Layout: tall container (350vh) → sticky inner panel (100vh).
 * - Video scrubs from frame 0 to end over the first 70% of available scroll.
 * - Text (label → heading → quote) fades + rises in staggered from 50%–85%.
 * - Last 30% of scroll: video holds on final frame + text fully visible = "linger".
 */
export default function ScrollVideoSection() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headRef  = useRef<HTMLHeadingElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    let raf = 0

    // Elements animated by scroll
    const textEls: Array<{ el: HTMLElement; start: number; end: number }> = []

    const init = () => {
      if (labelRef.current) textEls.push({ el: labelRef.current, start: 0.50, end: 0.68 })
      if (headRef.current)  textEls.push({ el: headRef.current,  start: 0.57, end: 0.75 })
      if (quoteRef.current) textEls.push({ el: quoteRef.current, start: 0.64, end: 0.85 })
    }
    init()

    const tick = () => {
      const rect        = wrap.getBoundingClientRect()
      const totalScroll = wrap.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return

      const scrolled = Math.max(0, -rect.top)
      const p = Math.min(1, scrolled / totalScroll)   // 0 → 1 across full linger height

      // Video scrubs over first 70% of scroll, then holds
      const vp = Math.min(1, p / 0.70)
      if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
        video.currentTime = vp * video.duration
      }

      // Text elements: fade + rise each at their own window
      textEls.forEach(({ el, start, end }) => {
        const tp = Math.max(0, Math.min(1, (p - start) / (end - start)))
        el.style.opacity   = String(tp)
        el.style.transform = `translateY(${(1 - tp) * 22}px)`
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    // Run once so elements start in correct state
    tick()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    /*
     * Outer wrapper — 350vh tall.
     * 350vh − 100vh viewport = 250vh of available scroll.
     * Video covers 70% → 175vh; final-frame linger = 75vh.
     */
    <div ref={wrapRef} style={{ height: '350vh', position: 'relative' }}>

      {/* Sticky panel: stays at top for the full 250vh of scroll */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src="/media/slider-animation.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient: dark at bottom for text legibility */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(30,27,21,0.82) 0%, rgba(30,27,21,0.25) 45%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text overlay — fades in during scroll */}
        <div
          style={{
            position: 'absolute',
            bottom: '13%',
            left: 0,
            right: 0,
            padding: '0 2rem',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Section label */}
          <p
            ref={labelRef}
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,220,195,0.9)',
              background: 'rgba(255,248,242,0.12)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '1.25rem',
              opacity: 0,
              willChange: 'opacity, transform',
            }}
          >
            Talleres
          </p>

          {/* Main heading */}
          <h2
            ref={headRef}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--surface)',
              marginBottom: '1.25rem',
              opacity: 0,
              willChange: 'opacity, transform',
            }}
          >
            Elige tu tarde
          </h2>

          {/* Italic quote */}
          <p
            ref={quoteRef}
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255,248,242,0.65)',
              maxWidth: '32rem',
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: 0,
              willChange: 'opacity, transform',
            }}
          >
            &ldquo;Cada pieza cuenta la historia de las manos que la sostuvieron.&rdquo;
          </p>
        </div>

      </div>
    </div>
  )
}
