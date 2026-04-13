'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Full-viewport hero video.
 *
 * - Poster image is shown immediately (zero lag).
 * - Video fades in on top once it can play (canplay event).
 * - JS timeupdate loop: seeks back 80ms before end to avoid the
 *   browser's built-in loop gap.
 * - On touch/mobile devices the video is skipped entirely — only
 *   the poster is shown. Mobile browsers routinely block or stall
 *   large autoplay videos; a crisp static image is better UX.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [isMobile, setIsMobile]     = useState(false)

  useEffect(() => {
    // Detect touch device — runs only on client so no hydration mismatch
    const mobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsMobile(mobile)
    if (mobile) return   // skip all video logic on mobile

    const v = videoRef.current
    if (!v) return

    const handleCanPlay = () => {
      v.play().catch(() => {})
      setVideoReady(true)
    }

    const handleTimeUpdate = () => {
      if (v.duration && v.currentTime >= v.duration - 0.08) {
        v.currentTime = 0
      }
    }

    v.addEventListener('canplay', handleCanPlay)
    v.addEventListener('timeupdate', handleTimeUpdate)

    // Already buffered enough (e.g. back-forward cache)
    if (v.readyState >= 2) {
      v.play().catch(() => {})
      setVideoReady(true)
    }

    return () => {
      v.removeEventListener('canplay', handleCanPlay)
      v.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  }

  return (
    <>
      {/* Poster — always visible, sits behind the video */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/studio-hero.jpeg"
        alt=""
        aria-hidden="true"
        style={{ ...baseStyle, zIndex: 0 }}
      />

      {/* Video — only rendered on desktop, fades in once ready */}
      {!isMobile && (
        <video
          ref={videoRef}
          src="/media/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            ...baseStyle,
            zIndex: 1,
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
      )}
    </>
  )
}
