'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  BASELINE_TESTS_TODAY,
  TEST_INCREMENT_INTERVAL_MS,
  TEST_INCREMENT_MAX,
  TEST_INCREMENT_MIN
} from '@/lib/constants'

export function Hero() {
  const [testsToday, setTestsToday] = useState(BASELINE_TESTS_TODAY)

  useEffect(() => {
    const interval = setInterval(() => {
      const increment =
        Math.floor(Math.random() * (TEST_INCREMENT_MAX - TEST_INCREMENT_MIN + 1)) + TEST_INCREMENT_MIN
      setTestsToday((value) => value + increment)
    }, TEST_INCREMENT_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="px-6 pb-20 pt-10 md:px-12 md:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Cognitive Speed Test
          </p>
          <h1 className="text-[44px] font-semibold leading-[0.95] tracking-tight md:text-[72px]">
            You&apos;re Worse Than 78% of People
          </h1>
          <p className="max-w-xl text-lg text-white/70 md:text-xl">
            10-second test. Instant percentile. Prepare to be humbled.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/select"
              className="pulse-cta border border-accent bg-accent px-8 py-4 text-sm uppercase tracking-[0.35em] text-white shadow-glow transition hover:scale-[1.02]"
            >
              Test Yourself
            </Link>
            <div className="text-sm uppercase tracking-[0.3em] text-white/50">
              {testsToday.toLocaleString()} tests taken today
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm uppercase tracking-[0.25em] text-white/50">
            <span>Live percentile</span>
            <span>No signup required</span>
            <span>Brutally honest</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3"
        >
          <div className="border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Signal</p>
            <p className="mt-3 text-2xl">One tap. Pure reflex.</p>
          </div>
          <div className="border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Proof</p>
            <p className="mt-3 text-2xl">Realistic percentile curve.</p>
          </div>
          <div className="border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Addictive</p>
            <p className="mt-3 text-2xl">One more test won&apos;t hurt.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
