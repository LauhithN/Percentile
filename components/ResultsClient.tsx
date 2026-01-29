'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { ResultsCard } from '@/components/ResultsCard'
import { TestCard } from '@/components/TestCard'
import { Waitlist } from '@/components/Waitlist'
import {
  calculateReactionPercentile,
  calculateMemoryPercentile,
  calculateFocusPercentile
} from '@/lib/percentile'
import { TESTS, TestType } from '@/lib/tests'
import { readLastResult, readUserStats, type UserStats } from '@/lib/userStats'

const Leaderboard = dynamic(() => import('@/components/Leaderboard').then((mod) => mod.Leaderboard), {
  ssr: false,
  loading: () => (
    <div className="mt-16 border border-white/10 p-8 text-sm uppercase tracking-[0.3em] text-white/50">
      Loading leaderboard...
    </div>
  )
})

type ResultPayload =
  | {
      testType: 'reaction'
      avg: number
      times: number[]
    }
  | {
      testType: 'memory'
      longestSequence: number
      totalCorrect: number
      avgSpeed: number
    }
  | {
      testType: 'focus'
      blueHit: number
      blueTotal: number
      redHit: number
      redTotal: number
      avgSpeed: number
    }

export function ResultsClient() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<ResultPayload | null>(null)
  const [percentile, setPercentile] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [userStats, setUserStats] = useState<UserStats>({})

  useEffect(() => {
    const stats = readUserStats()
    const count = [stats.reaction, stats.memory, stats.focus].filter((entry) => entry?.completed).length
    setCompletedCount(count)
    setUserStats(stats)
  }, [])

  useEffect(() => {
    const testParam = searchParams.get('test') as TestType | null

    if (testParam) {
      if (testParam === 'reaction') {
        const avg = Number(searchParams.get('avg'))
        const timesParam = searchParams.get('times')
        const times = timesParam ? timesParam.split(',').map((value) => Number(value)) : []
        if (!Number.isNaN(avg) && times.length) {
          setResult({ testType: 'reaction', avg, times })
          setPercentile(calculateReactionPercentile(avg))
          return
        }
      }

      if (testParam === 'memory') {
        const longestSequence = Number(searchParams.get('longest'))
        const totalCorrect = Number(searchParams.get('correct'))
        const avgSpeed = Number(searchParams.get('speed'))
        if (!Number.isNaN(longestSequence) && !Number.isNaN(totalCorrect) && !Number.isNaN(avgSpeed)) {
          setResult({ testType: 'memory', longestSequence, totalCorrect, avgSpeed })
          setPercentile(calculateMemoryPercentile(longestSequence, totalCorrect, avgSpeed))
          return
        }
      }

      if (testParam === 'focus') {
        const blueHit = Number(searchParams.get('blueHit'))
        const blueTotal = Number(searchParams.get('blueTotal'))
        const redHit = Number(searchParams.get('redHit'))
        const redTotal = Number(searchParams.get('redTotal'))
        const avgSpeed = Number(searchParams.get('speed'))
        if (
          !Number.isNaN(blueHit) &&
          !Number.isNaN(blueTotal) &&
          !Number.isNaN(redHit) &&
          !Number.isNaN(redTotal) &&
          !Number.isNaN(avgSpeed)
        ) {
          setResult({ testType: 'focus', blueHit, blueTotal, redHit, redTotal, avgSpeed })
          setPercentile(calculateFocusPercentile(blueHit, blueTotal, redHit, redTotal, avgSpeed))
          return
        }
      }
    }

    const last = readLastResult()
    if (last) {
      if (last.test === 'reaction' && last.reaction) {
        setResult({ testType: 'reaction', avg: last.reaction.avg, times: last.reaction.times })
        setPercentile(last.percentile)
      }
      if (last.test === 'memory' && last.memory) {
        setResult({
          testType: 'memory',
          longestSequence: last.memory.longestSequence,
          totalCorrect: last.memory.totalCorrect,
          avgSpeed: last.memory.avgSpeed
        })
        setPercentile(last.percentile)
      }
      if (last.test === 'focus' && last.focus) {
        setResult({
          testType: 'focus',
          blueHit: last.focus.blueHit,
          blueTotal: last.focus.blueTotal,
          redHit: last.focus.redHit,
          redTotal: last.focus.redTotal,
          avgSpeed: last.focus.avgSpeed
        })
        setPercentile(last.percentile)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!percentile || percentile <= 70) return

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
  }, [percentile])

  const resultView = useMemo(() => {
    if (!result) return null

    if (result.testType === 'reaction') {
      const best = Math.min(...result.times)
      return {
        testType: 'reaction' as const,
        title: 'Reaction Speed',
        resultLine: `You're faster than ${percentile}% of people`,
        statLine: `${result.avg}ms average / ${best}ms best`,
        breakdown: result.times.map((time, index) => ({
          label: `Round ${index + 1}`,
          value: `${time}ms`
        })),
        comparison: {
          topLabel: 'Faster than',
          topValue: 'Average person',
          bottomLabel: 'Slower than',
          bottomValue: 'Pro gamer'
        },
        bellCurve: { leftLabel: 'Slow', rightLabel: 'Fast', accent: '#0066FF' },
        testRoute: '/test/reaction'
      }
    }

    if (result.testType === 'memory') {
      return {
        testType: 'memory' as const,
        title: 'Memory Sequence',
        resultLine: `You remembered ${percentile}% more than average`,
        statLine: `Longest ${result.longestSequence} / ${result.totalCorrect}/25 correct / ${result.avgSpeed}ms tap`,
        breakdown: [
          { label: 'Longest sequence', value: `${result.longestSequence}` },
          { label: 'Total correct', value: `${result.totalCorrect} tiles` },
          { label: 'Avg tap speed', value: `${result.avgSpeed}ms` }
        ],
        comparison: {
          topLabel: 'Remembered more than',
          topValue: 'Average player',
          bottomLabel: 'Behind',
          bottomValue: 'Memory athlete'
        },
        bellCurve: { leftLabel: 'Foggy', rightLabel: 'Sharp', accent: '#7C3AED' },
        testRoute: '/test/memory'
      }
    }

    const redAvoid = result.redTotal ? (result.redTotal - result.redHit) / result.redTotal : 0
    const totalClicks = result.blueHit + result.redHit
    const accuracyRate = totalClicks ? (result.blueHit - result.redHit) / totalClicks : 0

    return {
      testType: 'focus' as const,
      title: 'Focus & Accuracy',
      resultLine: `You're ${percentile}% more focused than most`,
      statLine: `Accuracy ${(accuracyRate * 100).toFixed(0)}% / ${result.avgSpeed}ms avg`,
      breakdown: [
        { label: 'Blue hits', value: `${result.blueHit}/${result.blueTotal}` },
        { label: 'Red avoided', value: `${Math.round(redAvoid * 100)}%` },
        { label: 'Avg hit speed', value: `${result.avgSpeed}ms` }
      ],
      comparison: {
        topLabel: 'More focused than',
        topValue: 'Average multitasker',
        bottomLabel: 'Behind',
        bottomValue: 'Elite marksman'
      },
      bellCurve: { leftLabel: 'Distracted', rightLabel: 'Locked in', accent: '#10B981' },
      testRoute: '/test/focus'
    }
  }, [result, percentile])

  if (!result || !resultView) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-20 md:px-12">
          <div className="border border-white/10 p-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">No results yet</p>
            <h1 className="mt-4 text-3xl">Take a test to see your percentile.</h1>
          </div>
        </section>
      </main>
    )
  }

  const otherTests = TESTS.filter((test) => test.id !== result.testType)

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">{resultView.title} Results</p>
        <h1 className="mt-4 text-4xl md:text-5xl">You&apos;re worse than you thought.</h1>
        <p className="mt-3 text-white/60">Realistic stats based on a human performance distribution.</p>
        <div className="mt-4 text-xs uppercase tracking-[0.35em] text-white/50">
          You&apos;ve completed {completedCount}/3 tests. Try the others!
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reaction</p>
            <p className="mt-3 text-2xl">{userStats.reaction ? `${userStats.reaction.percentile}%` : 'Not tested'}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
              {userStats.reaction ? `${userStats.reaction.avgTime}ms avg` : 'Complete reaction test'}
            </p>
          </div>
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Memory</p>
            <p className="mt-3 text-2xl">{userStats.memory ? `${userStats.memory.percentile}%` : 'Not tested'}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
              {userStats.memory ? `Longest ${userStats.memory.longestSeq}` : 'Complete memory test'}
            </p>
          </div>
          <div className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Focus</p>
            <p className="mt-3 text-2xl">{userStats.focus ? `${userStats.focus.percentile}%` : 'Not tested'}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
              {userStats.focus ? `${Math.round(userStats.focus.accuracy * 100)}% accuracy` : 'Complete focus test'}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <ResultsCard
            testType={resultView.testType}
            percentile={percentile}
            resultLine={resultView.resultLine}
            statLine={resultView.statLine}
            breakdown={resultView.breakdown}
            comparison={resultView.comparison}
            testRoute={resultView.testRoute}
            bellCurve={resultView.bellCurve}
          />
        </div>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Try another test</p>
          <h2 className="mt-4 text-2xl">Pick your next challenge</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {otherTests.map((test) => (
              <TestCard key={test.id} {...test} compact />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Waitlist source="results" variant="compact" />
        </section>

        <Leaderboard />
      </section>
    </main>
  )
}
