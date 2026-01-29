'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateMemoryPercentile } from '@/lib/percentile'
import { setLastResult, updateUserStats } from '@/lib/userStats'

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' }
]

const ROUNDS = [3, 4, 5, 6, 7]

type Phase = 'idle' | 'showing' | 'input' | 'feedback'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function MemoryTest() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [roundIndex, setRoundIndex] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [inputIndex, setInputIndex] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null)
  const [errorText, setErrorText] = useState('')

  const roundCorrectRef = useRef(true)
  const longestRef = useRef(0)
  const totalCorrectRef = useRef(0)
  const clickIntervalsRef = useRef<number[]>([])
  const inputStartRef = useRef(0)
  const lastClickRef = useRef<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const startRound = (index: number) => {
    const length = ROUNDS[index]
    const nextSequence = Array.from({ length }, () => Math.floor(Math.random() * 4))
    roundCorrectRef.current = true
    setFeedback(null)
    setErrorText('')
    setSequence(nextSequence)
    setInputIndex(0)
    setActiveIndex(null)
    setStatusText('Watch the sequence')
    setPhase('showing')
  }

  const startTest = () => {
    longestRef.current = 0
    totalCorrectRef.current = 0
    clickIntervalsRef.current = []
    setRoundIndex(0)
    startRound(0)
  }

  useEffect(() => {
    if (phase !== 'showing' || sequence.length === 0) return
    let canceled = false

    const play = async () => {
      for (const index of sequence) {
        if (canceled) return
        setActiveIndex(index)
        await sleep(600)
        setActiveIndex(null)
        await sleep(400)
      }

      if (canceled) return
      inputStartRef.current = performance.now()
      lastClickRef.current = null
      setStatusText('Your turn')
      setPhase('input')
    }

    play()

    return () => {
      canceled = true
    }
  }, [phase, sequence])

  const handleSquarePress = (index: number) => {
    if (phase !== 'input') return

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    const now = performance.now()
    const delta = lastClickRef.current ? now - lastClickRef.current : now - inputStartRef.current
    lastClickRef.current = now
    clickIntervalsRef.current.push(delta)

    const expected = sequence[inputIndex]
    const isCorrect = index === expected
    const nextRoundCorrect = roundCorrectRef.current && isCorrect
    roundCorrectRef.current = nextRoundCorrect

    if (isCorrect) {
      totalCorrectRef.current += 1
      setErrorText('')
    } else {
      setErrorText(`Wrong. Expected ${COLORS[expected].name}.`)
      window.setTimeout(() => setErrorText(''), 600)
    }

    const nextInputIndex = inputIndex + 1
    setInputIndex(nextInputIndex)

    if (nextInputIndex >= sequence.length) {
      if (nextRoundCorrect) {
        longestRef.current = Math.max(longestRef.current, sequence.length)
      }

      setFeedback(nextRoundCorrect ? 'success' : 'fail')
      setPhase('feedback')
      setStatusText(nextRoundCorrect ? 'Perfect' : 'Keep going')

      window.setTimeout(() => {
        const nextRound = roundIndex + 1
        if (nextRound >= ROUNDS.length) {
          finishTest()
        } else {
          setRoundIndex(nextRound)
          startRound(nextRound)
        }
      }, 700)
    }
  }

  const finishTest = () => {
    const averageSpeed = clickIntervalsRef.current.length
      ? Math.round(
          clickIntervalsRef.current.reduce((sum, value) => sum + value, 0) / clickIntervalsRef.current.length
        )
      : 1800

    const longestSequence = longestRef.current
    const totalCorrect = totalCorrectRef.current
    const percentile = calculateMemoryPercentile(longestSequence, totalCorrect, averageSpeed)

    setLastResult({
      test: 'memory',
      percentile,
      memory: {
        longestSequence,
        totalCorrect,
        avgSpeed: averageSpeed
      }
    })

    updateUserStats({
      memory: {
        percentile,
        longestSeq: longestSequence,
        completed: true
      }
    })

    router.push(
      `/results?test=memory&longest=${longestSequence}&correct=${totalCorrect}&speed=${averageSpeed}`
    )
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-10 bg-ink px-6 py-12 text-center">
      <div className="absolute left-6 top-6 text-xs uppercase tracking-[0.4em] text-white/60">
        Round {roundIndex + 1}/{ROUNDS.length}
      </div>

      {phase === 'idle' && (
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Memory Sequence</p>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Repeat the sequence perfectly.</h1>
          <p className="mt-3 text-white/70">Watch the tiles light up. Then tap them in order.</p>
          <button
            onClick={startTest}
            className="mt-8 border border-accent bg-accent px-8 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:scale-[1.02]"
          >
            Start Test
          </button>
        </div>
      )}

      {phase !== 'idle' && (
        <div className="flex w-full max-w-3xl flex-col items-center gap-6">
          <div className="text-xs uppercase tracking-[0.4em] text-white/60">{statusText}</div>
          {errorText && <div className="text-xs uppercase tracking-[0.3em] text-red-400">{errorText}</div>}
          <div className="grid w-full grid-cols-2 gap-5">
            {COLORS.map((color, index) => (
              <button
                key={color.name}
                onPointerDown={() => handleSquarePress(index)}
                className={`aspect-square w-full transition ${activeIndex === index ? 'scale-[1.04] shadow-[0_0_40px_rgba(255,255,255,0.2)]' : ''}`}
                style={{
                  backgroundColor: color.value,
                  opacity: phase === 'showing' && activeIndex !== index ? 0.4 : 1,
                  cursor: phase === 'input' ? 'pointer' : 'default'
                }}
                disabled={phase !== 'input'}
              />
            ))}
          </div>
          {feedback && (
            <div className={`text-2xl ${feedback === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {feedback === 'success' ? '?' : '?'}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
