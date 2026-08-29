'use client'

import { useEffect, useRef, useState } from 'react'
import { Wordmark } from './Wordmark'

const SEEN_KEY = 'execuneed.wordmark-played'

/**
 * The animated logo, used once per session on the homepage.
 *
 * Deliberately NOT a load or route-transition splash. The clip runs six
 * seconds; gating every page on it would push the largest contentful paint
 * from ~1.7s to past six, and on a page whose whole job is to get a worried
 * family to fill in a form, that is a conversion problem rather than a flourish.
 *
 * So: it plays once per browser session, only here, and the static wordmark is
 * rendered underneath it the entire time. Nothing waits for the video — if it
 * fails, is blocked, or the visitor prefers reduced motion, the page is
 * already complete without it.
 */
export function AnimatedWordmark({ width = 190 }: { width?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let alreadyPlayed = false
    try {
      alreadyPlayed = window.sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      // Private browsing. Treat as already played rather than replaying on
      // every navigation, which would be worse than never showing it.
      alreadyPlayed = true
    }
    if (alreadyPlayed) return

    const video = videoRef.current
    if (!video) return

    const onCanPlay = () => {
      setPlaying(true)
      video.play().catch(() => setPlaying(false))
    }

    /**
     * The clip is 566KB. Attaching it during mount made it compete with the
     * fonts and scripts of the initial load and pushed LCP from 1.7s to 2.7s —
     * a measurable regression on the page whose job is to convert. It is a
     * flourish, so it waits until the page has actually finished loading and
     * the main thread is idle. Nothing on screen depends on it.
     *
     * The source is attached here rather than in markup for a second reason:
     * with preload="none" and a <source> child, play() is called before any
     * media data exists and the browser rejects it silently.
     */
    let cancelled = false
    let idleHandle: number | undefined

    const start = () => {
      if (cancelled) return
      const run = () => {
        if (cancelled) return
        video.addEventListener('canplay', onCanPlay, { once: true })
        video.src = '/brand/logo-animated.mp4'
        video.load()
      }
      const idle = window.requestIdleCallback as
        | ((cb: () => void, opts?: { timeout: number }) => number)
        | undefined
      idleHandle = idle ? idle(run, { timeout: 3000 }) : window.setTimeout(run, 800)
    }

    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      cancelled = true
      window.removeEventListener('load', start)
      if (idleHandle !== undefined) {
        const cancelIdle = window.cancelIdleCallback as ((h: number) => void) | undefined
        if (cancelIdle) cancelIdle(idleHandle)
        else window.clearTimeout(idleHandle)
      }
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  // Marked seen only once playback actually begins, not when it is requested.
  // Setting it up front meant a React StrictMode remount in development found
  // the flag already written and skipped the animation entirely.
  function markSeen() {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private browsing; nothing to do */
    }
  }

  return (
    <div className="relative inline-block w-[150px] sm:w-[190px]">
      <Wordmark width={width} className="h-auto w-full" />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={markSeen}
        onEnded={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
