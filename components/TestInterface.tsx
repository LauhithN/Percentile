'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateReactionPercentile } from '@/lib/percentile'
import { setLastResult, updateUserStats } from '@/lib/userStats'

const TOTAL_ROUNDS = 5

type Phase = 'idle' | 'countdown' | 'waiting' | 'go' | 'calculating'

export function ReactionTest() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [countdown, setCountdown] = useState(3)
  const [round, setRound] = useState(1)
  const [times, setTimes] = useState<number[]>([])
  const [message, setMessage] = useState('')

  const startRef = useRef(0)
  const phaseRef = useRef<Phase>('idle')
  const roundRef = useRef(1)
  const timesRef = useRef<number[]>([])
  const lastTouchRef = useRef(0)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    roundRef.current = round
  }, [round])

  useEffect(() => {
    timesRef.current = times
  }, [times])

  const resetRound = () => {
    setCountdown(3)
    setPhase('countdown')
  }

  const startTest = () => {
    setTimes([])
    setRound(1)
    setMessage('')
    resetRound()
  }

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) {
      setPhase('waiting')
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [phase, countdown])

  useEffect(() => {
    if (phase !== 'waiting') return
    const delay = 1000 + Math.random() * 2000
    const timer = window.setTimeout(() => {
      startRef.current = performance.now()
      setPhase('go')
    }, delay)

    return () => window.clearTimeout(timer)
  }, [phase])

  const finishTest = (allTimes: number[]) => {
    const avg = Math.round(allTimes.reduce((sum, value) => sum + value, 0) / allTimes.length)
    const percentile = calculateReactionPercentile(avg)

    setLastResult({
      test: 'reaction',
      percentile,
      reaction: { avg, times: allTimes }
    })

    updateUserStats({
      reaction: {
        percentile,
        avgTime: avg,
        completed: true
      }
    })

    setPhase('calculating')
    window.setTimeout(() => {
      router.push(`/results?test=reaction&avg=${avg}&times=${allTimes.join(',')}`)
    }, 2000)
  }

  useEffect(() => {
    const handlePress = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const now = performance.now()
      if (event.type === 'touchstart') {
        lastTouchRef.current = now
      }
      if (event.type === 'mousedown' && now - lastTouchRef.current < 600) {
        return
      }

      const currentPhase = phaseRef.current

      if (currentPhase === 'idle') {
        startTest()
        return
      }

      if (currentPhase === 'countdown' || currentPhase === 'waiting') {
        setMessage('Too soon. Resetting...')
        resetRound()
        return
      }

      if (currentPhase === 'go') {
        const reaction = Math.max(0, Math.round(now - startRef.current))
        const updated = [...timesRef.current, reaction]
        setTimes(updated)

        if (roundRef.current >= TOTAL_ROUNDS) {
          finishTest(updated)
        } else {
          setRound((value) => value + 1)
          setMessage('')
          window.setTimeout(() => resetRound(), 150)
        }
      }
    }

    document.addEventListener('mousedown', handlePress, { passive: false })
    document.addEventListener('touchstart', handlePress, { passive: false })

    return () => {
      document.removeEventListener('mousedown', handlePress)
      document.removeEventListener('touchstart', handlePress)
    }
  }, [])

  const background =
    phase === 'waiting'
      ? 'bg-danger'
      : phase === 'go'
        ? 'bg-success'
        : 'bg-ink'

  const transitionsEnabled = phase === 'idle' || phase === 'calculating'

  return (
    <main
      className={`relative flex min-h-[100dvh] cursor-pointer items-center justify-center ${transitionsEnabled ? 'transition-colors duration-200 ease-in-out' : ''} ${background}`}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute left-6 top-6 text-xs uppercase tracking-[0.4em] text-white/70">
        Round {round}/{TOTAL_ROUNDS}
      </div>

      {phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Reaction Test</p>
          <h1 className="text-3xl font-semibold md:text-5xl">Click as fast as you can when you see GREEN</h1>
          <button className="border border-white px-8 py-3 text-xs uppercase tracking-[0.3em] transition hover:border-accent hover:text-accent">
            Start Test
          </button>
        </motion.div>
      )}

      {phase === 'countdown' && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Get ready</p>
          <div className="mt-4 text-[96px] font-semibold leading-none md:text-[120px]">{countdown}</div>
          {message && <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60">{message}</p>}
        </div>
      )}

      {phase === 'waiting' && (
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/80">Wait for green</p>
        </div>
      )}

      {phase === 'go' && (
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/80">Click now</p>
        </div>
      )}

      {phase === 'calculating' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Calculating...</p>
          <div className="mt-4 h-1 w-48 overflow-hidden bg-white/20">
            <motion.div
              className="h-full bg-accent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </main>
  )
}
