'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * Full-viewport hero video.
 *
 * Strategy:
 * - Poster (next/image with priority) is shown immediately — zero LCP lag.
 * - Video has autoPlay + loop as HTML attributes for maximum browser
 *   compatibility. JS smooth-loop (timeupdate) overrides the native loop
 *   gap once the video is playing.
 * - Video fades in on top once it can play. A 2 s fallback timeout ensures
 *   it always becomes visible even if canplay fires late on slow connections.
 * - On touch/mobile devices the video is skipped entirely — only the
 *   poster is shown (avoids stalling a 4 MB download on mobile data).
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [isMobile, setIsMobile]     = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsMobile(mobile)
    if (mobile) return

    const v = videoRef.current
    if (!v) return

    const show = () => setVideoReady(true)

    // Fade in as soon as the first frame is ready
    v.addEventListener('canplay', show)

    // Fallback: make it visible after 2 s regardless, so a slow connection
    // never leaves users staring at the poster indefinitely
    const fallback = setTimeout(show, 2000)

    // Smooth loop: seek back just before the native loop gap
    const handleTimeUpdate = () => {
      if (v.duration && v.currentTime >= v.duration - 0.08) {
        v.currentTime = 0
      }
    }
    v.addEventListener('timeupdate', handleTimeUpdate)

    // If already buffered (back-forward cache), show immediately
    if (v.readyState >= 2) show()

    return () => {
      v.removeEventListener('canplay', show)
      v.removeEventListener('timeupdate', handleTimeUpdate)
      clearTimeout(fallback)
    }
  }, [])

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }

  return (
    <>
      {/* Poster — priority-loaded, visible on all devices */}
      <Image
        src="/media/studio-hero.jpeg"
        alt=""
        aria-hidden="true"
        fill
        priority
        style={{ objectFit: 'cover', zIndex: 0 }}
        sizes="100vw"
      />

      {/* Video — desktop only, fades in once ready */}
      {!isMobile && (
        <video
          ref={videoRef}
          src="/media/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            ...base,
            zIndex: 1,
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      )}
    </>
  )
}
