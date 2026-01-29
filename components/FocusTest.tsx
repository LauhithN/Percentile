'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateFocusPercentile } from '@/lib/percentile'
import { setLastResult, updateUserStats } from '@/lib/userStats'

const DURATION_MS = 30000
const BLUE = '#3B82F6'
const RED = '#EF4444'

interface Circle {
  id: string
  x: number
  y: number
  size: number
  type: 'blue' | 'red'
  spawnedAt: number
}

interface Ripple {
  id: string
  x: number
  y: number
  size: number
  color: string
}

type Phase = 'idle' | 'countdown' | 'running' | 'finished'

export function FocusTest() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(30)
  const [circles, setCircles] = useState<Circle[]>([])
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [flash, setFlash] = useState<'red' | 'green' | null>(null)
  const [blueHitDisplay, setBlueHitDisplay] = useState(0)
  const [blueTotalDisplay, setBlueTotalDisplay] = useState(0)

  const phaseRef = useRef<Phase>('idle')
  const spawnTimeoutRef = useRef<number | null>(null)
  const endTimeoutRef = useRef<number | null>(null)
  const blueTotalRef = useRef(0)
  const redTotalRef = useRef(0)
  const blueHitRef = useRef(0)
  const redHitRef = useRef(0)
  const blueSpeedRef = useRef<number[]>([])
  const startTimeRef = useRef(0)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const startTest = () => {
    blueTotalRef.current = 0
    redTotalRef.current = 0
    blueHitRef.current = 0
    redHitRef.current = 0
    blueSpeedRef.current = []
    setCircles([])
    setRipples([])
    setBlueHitDisplay(0)
    setBlueTotalDisplay(0)
    setCountdown(3)
    setPhase('countdown')
  }

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) {
      setPhase('running')
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [phase, countdown])

  useEffect(() => {
    if (phase !== 'running') return

    startTimeRef.current = performance.now()
    setTimeLeft(30)

    const tick = window.setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000
      setTimeLeft(Math.max(0, 30 - Math.floor(elapsed)))
    }, 200)

    const endTimer = window.setTimeout(() => {
      finishTest()
    }, DURATION_MS)

    endTimeoutRef.current = endTimer

    spawnLoop()

    return () => {
      window.clearInterval(tick)
      if (endTimeoutRef.current) window.clearTimeout(endTimeoutRef.current)
      if (spawnTimeoutRef.current) window.clearTimeout(spawnTimeoutRef.current)
    }
  }, [phase])

  const spawnLoop = () => {
    if (phaseRef.current !== 'running') return
    spawnCircle()
    const delay = 600 + Math.random() * 200
    spawnTimeoutRef.current = window.setTimeout(spawnLoop, delay)
  }

  const spawnCircle = () => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const size = 60 + Math.random() * 20
    const margin = 20
    const rangeX = Math.max(1, rect.width - size - margin * 2)
    const rangeY = Math.max(1, rect.height - size - margin * 2)
    const x = margin + Math.random() * rangeX
    const y = margin + Math.random() * rangeY
    const isBlue = Math.random() < 0.7

    const circle: Circle = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      size,
      type: isBlue ? 'blue' : 'red',
      spawnedAt: performance.now()
    }

    if (isBlue) {
      blueTotalRef.current += 1
      setBlueTotalDisplay(blueTotalRef.current)
    } else {
      redTotalRef.current += 1
    }

    setCircles((prev) => [...prev, circle])

    window.setTimeout(() => {
      setCircles((prev) => prev.filter((item) => item.id !== circle.id))
    }, 1500)
  }

  const handleHit = (circle: Circle) => {
    if (phaseRef.current !== 'running') return

    setCircles((prev) => prev.filter((item) => item.id !== circle.id))

    if (circle.type === 'blue') {
      blueHitRef.current += 1
      setBlueHitDisplay(blueHitRef.current)
      blueSpeedRef.current.push(performance.now() - circle.spawnedAt)
      setFlash('green')
      spawnRipple(circle, 'green')
    } else {
      redHitRef.current += 1
      setFlash('red')
      spawnRipple(circle, 'red')
    }

    window.setTimeout(() => setFlash(null), 120)
  }

  const spawnRipple = (circle: Circle, color: 'red' | 'green') => {
    const ripple: Ripple = {
      id: `${circle.id}-ripple`,
      x: circle.x,
      y: circle.y,
      size: circle.size,
      color: color === 'green' ? '#22C55E' : '#EF4444'
    }
    setRipples((prev) => [...prev, ripple])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== ripple.id))
    }, 400)
  }

  const finishTest = () => {
    setPhase('finished')
    const blueHit = blueHitRef.current
    const blueTotal = blueTotalRef.current
    const redHit = redHitRef.current
    const redTotal = redTotalRef.current
    const avgSpeed = blueSpeedRef.current.length
      ? Math.round(blueSpeedRef.current.reduce((sum, value) => sum + value, 0) / blueSpeedRef.current.length)
      : 1000

    const percentile = calculateFocusPercentile(blueHit, blueTotal, redHit, redTotal, avgSpeed)
    const safeBlueTotal = Math.max(1, blueTotal)
    const accuracy = blueHit / safeBlueTotal

    setLastResult({
      test: 'focus',
      percentile,
      focus: {
        blueHit,
        blueTotal,
        redHit,
        redTotal,
        avgSpeed
      }
    })

    updateUserStats({
      focus: {
        percentile,
        accuracy,
        completed: true
      }
    })

    router.push(
      `/results?test=focus&blueHit=${blueHit}&blueTotal=${blueTotal}&redHit=${redHit}&redTotal=${redTotal}&speed=${avgSpeed}`
    )
  }

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink px-6 py-12 text-center touch-none select-none"
    >
      {flash && (
        <div
          className={`pointer-events-none absolute inset-0 ${flash === 'red' ? 'bg-red-500/20' : 'bg-green-500/15'} focus-flash`}
        />
      )}

      {phase === 'idle' && (
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Focus & Accuracy</p>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Tap only the blue circles.</h1>
          <p className="mt-3 text-white/70">Avoid red. Stay sharp for 30 seconds.</p>
          <button
            onClick={startTest}
            className="mt-8 border border-accent bg-accent px-8 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:scale-[1.02]"
          >
            Start Test
          </button>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Get ready</p>
          <div className="mt-4 text-[96px] font-semibold leading-none md:text-[120px]">{countdown}</div>
        </div>
      )}

      {phase === 'running' && (
        <>
          <div className="absolute left-6 top-6 text-xs uppercase tracking-[0.4em] text-white/60">
            {timeLeft}s left
          </div>
          <div className="absolute right-6 top-6 text-xs uppercase tracking-[0.4em] text-white/60">
            Blue {blueHitDisplay}/{blueTotalDisplay}
          </div>
        </>
      )}

      {circles.map((circle) => (
        <button
          key={circle.id}
          onPointerDown={(event) => {
            event.preventDefault()
            handleHit(circle)
          }}
          className="absolute focus-ring"
          style={{
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            borderRadius: 999,
            backgroundColor: circle.type === 'blue' ? BLUE : RED,
            animation: 'fadeOut 1.5s ease-out forwards'
          }}
        />
      ))}

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: 999,
            border: `2px solid ${ripple.color}`,
            animation: 'ripple 0.4s ease-out forwards'
          }}
        />
      ))}
    </main>
  )
}
