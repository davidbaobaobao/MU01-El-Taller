'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-viewport autoplay hero video with seamless JS-driven loop.
 * Uses timeupdate to seek back 0.08 s before the end so there's
 * no visible gap between loops (browser loop attr adds a small stall).
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    const handleTimeUpdate = () => {
      if (v.duration && v.currentTime >= v.duration - 0.08) {
        v.currentTime = 0
      }
    }

    // Ensure play on mobile (muted autoplay is allowed, but some browsers
    // need an explicit .play() call after a user gesture or on load)
    const handleCanPlay = () => {
      v.play().catch(() => {
        // Silently fail — browser blocked autoplay; video is decorative
      })
    }

    v.addEventListener('timeupdate', handleTimeUpdate)
    v.addEventListener('canplaythrough', handleCanPlay)

    // Kick off immediately if already ready
    if (v.readyState >= 3) {
      v.play().catch(() => {})
    }

    return () => {
      v.removeEventListener('timeupdate', handleTimeUpdate)
      v.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [])

  return (
    <video
      ref={ref}
      src="/media/hero.mp4"
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
        zIndex: 0,
      }}
    />
  )
}
