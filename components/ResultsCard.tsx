'use client'

import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BellCurve } from './BellCurve'
import { ShareButtons } from './ShareButtons'
import { TestType } from '@/lib/tests'

interface ResultsCardProps {
  testType: TestType
  percentile: number
  resultLine: string
  statLine: string
  breakdown: Array<{ label: string; value: string }>
  comparison: {
    topLabel: string
    topValue: string
    bottomLabel: string
    bottomValue: string
  }
  testRoute: string
  bellCurve: {
    leftLabel: string
    rightLabel: string
    accent: string
  }
}

export function ResultsCard({
  testType,
  percentile,
  resultLine,
  statLine,
  breakdown,
  comparison,
  testRoute,
  bellCurve
}: ResultsCardProps) {
  const [displayPercentile, setDisplayPercentile] = useState(0)

  useEffect(() => {
    const controls = animate(0, percentile, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (value) => setDisplayPercentile(Math.round(value))
    })

    return () => controls.stop()
  }, [percentile])

  return (
    <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-8">
        <div className="border border-white/10 p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Your percentile</p>
          <div className="mt-4 text-[96px] font-semibold leading-none md:text-[120px]">
            <span className="bg-gradient-to-r from-[#0066FF] to-[#7C3AED] bg-clip-text text-transparent">
              {displayPercentile}%
            </span>
          </div>
          <p className="mt-4 text-2xl">{resultLine}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">{statLine}</p>
        </div>

        <div className="border border-white/10 p-8">
          <BellCurve percentile={percentile} leftLabel={bellCurve.leftLabel} rightLabel={bellCurve.rightLabel} accent={bellCurve.accent} />
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href={testRoute}
            className="border border-accent bg-accent px-6 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:scale-[1.02]"
          >
            Test Again
          </Link>
          <Link
            href="#leaderboard"
            className="border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:border-white"
          >
            View Leaderboard
          </Link>
          <button
            disabled
            title="Coming soon"
            className="border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white/40"
          >
            Get AI Analysis
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Comparison</p>
          <div className="mt-5 flex flex-col gap-4 text-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>{comparison.topLabel}</span>
              <span className="text-white/60">{comparison.topValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{comparison.bottomLabel}</span>
              <span className="text-white/60">{comparison.bottomValue}</span>
            </div>
          </div>
        </div>

        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Share</p>
          <p className="mt-3 text-sm text-white/70">Make them believe it.</p>
          <ShareButtons percentile={percentile} testType={testType} />
        </div>

        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Breakdown</p>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
