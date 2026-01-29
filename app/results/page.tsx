'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { ResultsCard } from '@/components/ResultsCard'
import { calculatePercentile } from '@/lib/percentile'

const Leaderboard = dynamic(() => import('@/components/Leaderboard').then((mod) => mod.Leaderboard), {
  ssr: false,
  loading: () => (
    <div className="mt-16 border border-white/10 p-8 text-sm uppercase tracking-[0.3em] text-white/50">
      Loading leaderboard...
    </div>
  )
})

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [avg, setAvg] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])

  useEffect(() => {
    const avgParam = searchParams.get('avg')
    const timesParam = searchParams.get('times')

    if (avgParam && timesParam) {
      setAvg(Number(avgParam))
      setTimes(timesParam.split(',').map((value) => Number(value)))
      return
    }

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('percentile:lastResult')
      if (stored) {
        const parsed = JSON.parse(stored) as { avg: number; times: number[] }
        setAvg(parsed.avg)
        setTimes(parsed.times)
      }
    }
  }, [searchParams])

  const percentile = useMemo(() => (avg ? calculatePercentile(avg) : 0), [avg])

  useEffect(() => {
    if (!avg) return
    if (percentile <= 70) return

    let canceled = false
    import('canvas-confetti').then((mod) => {
      if (canceled) return
      mod.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.3 },
        colors: ['#0066FF', '#7C3AED', '#FFFFFF']
      })
    })

    return () => {
      canceled = true
    }
  }, [avg, percentile])

  if (!avg || times.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-20 md:px-12">
          <div className="border border-white/10 p-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">No results yet</p>
            <h1 className="mt-4 text-3xl">Take the test to see your percentile.</h1>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Results</p>
        <h1 className="mt-4 text-4xl md:text-5xl">You&apos;re worse than you thought.</h1>
        <p className="mt-3 text-white/60">Realistic stats based on a human reaction-time distribution.</p>

        <div className="mt-10">
          <ResultsCard percentile={percentile} avg={avg} times={times} />
        </div>

        <Leaderboard />
      </section>
    </main>
  )
}

