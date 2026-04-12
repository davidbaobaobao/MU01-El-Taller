'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-driven video section.
 *
 * Layout: tall container (380vh) → sticky inner panel (100vh).
 * - Ease-out curve applied to scroll progress so the animation
 *   starts fast and decelerates into the final frame.
 * - Video scrubs over the first 65% of eased scroll, then holds.
 * - Text fades + rises staggered from 60%–90% of eased progress.
 * - Last 35% of scroll: final frame + text fully visible (linger).
 *
 * Mobile: video scrubbing is replaced by a poster image; text
 * animates in via IntersectionObserver when the section enters view.
 */

function easeOut(t: number): number {
  // Cubic ease-out: fast start, decelerates toward end
  return 1 - Math.pow(1 - t, 3)
}

export default function ScrollVideoSection() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headRef  = useRef<HTMLHeadingElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  // Detect touch/mobile once on mount
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsMobile(mobile)
  }, [])

  // ── Desktop: scroll-driven scrub ──────────────────────────────────
  useEffect(() => {
    if (isMobile) return  // handled separately below

    const wrap  = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    let raf = 0

    const textEls: Array<{ el: HTMLElement; start: number; end: number }> = []
    if (labelRef.current) textEls.push({ el: labelRef.current, start: 0.60, end: 0.74 })
    if (headRef.current)  textEls.push({ el: headRef.current,  start: 0.67, end: 0.81 })
    if (quoteRef.current) textEls.push({ el: quoteRef.current, start: 0.74, end: 0.90 })

    const tick = () => {
      const rect        = wrap.getBoundingClientRect()
      const totalScroll = wrap.offsetHeight - window.innerHeight
      if (totalScroll <= 0) return

      const scrolled = Math.max(0, -rect.top)
      const rawP = Math.min(1, scrolled / totalScroll)   // 0→1 linear
      const p    = easeOut(rawP)                          // ease-out applied

      // Video scrubs over first 65% of eased progress, then holds on final frame
      const vp = Math.min(1, p / 0.65)
      if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
        video.currentTime = vp * video.duration
      }

      // Text: fade + rise
      textEls.forEach(({ el, start, end }) => {
        const tp = Math.max(0, Math.min(1, (p - start) / (end - start)))
        el.style.opacity   = String(tp)
        el.style.transform = `translateY(${(1 - tp) * 24}px)`
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [isMobile])

  // ── Mobile: IntersectionObserver fade-in on text ──────────────────
  useEffect(() => {
    if (!isMobile) return

    const textEls = [
      { el: labelRef.current, delay: 0 },
      { el: headRef.current,  delay: 150 },
      { el: quoteRef.current, delay: 300 },
    ]

    // Show text immediately via CSS animation when section enters view
    const wrap = wrapRef.current
    if (!wrap) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        textEls.forEach(({ el, delay }) => {
          if (!el) return
          el.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
        obs.disconnect()
      },
      { threshold: 0.3 }
    )
    obs.observe(wrap)

    return () => obs.disconnect()
  }, [isMobile])

  return (
    /*
     * 380vh tall — sticky panel stays for 280vh of available scroll.
     * Video covers 65% → ~182vh; linger = ~98vh.
     */
    <div
      ref={wrapRef}
      style={{
        height: isMobile ? '100vh' : '380vh',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Video (hidden on mobile — too heavy to scrub) */}
        {!isMobile && (
          <video
            ref={videoRef}
            src="/media/slider-animation.mp4"
            muted
            playsInline
            preload="auto"
            poster="/media/studio-hero.jpeg"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Mobile: static poster image */}
        {isMobile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/media/studio-hero.jpeg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(30,27,21,0.88) 0%, rgba(30,27,21,0.30) 45%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text overlay */}
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
              transform: 'translateY(24px)',
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
              color: 'var(--surface)',
              marginBottom: '1.25rem',
              opacity: 0,
              willChange: 'opacity, transform',
              transform: 'translateY(24px)',
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
              color: 'rgba(255,248,242,0.65)',
              maxWidth: '32rem',
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: 0,
              willChange: 'opacity, transform',
              transform: 'translateY(24px)',
            }}
          >
            &ldquo;Cada pieza cuenta la historia de las manos que la sostuvieron.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
