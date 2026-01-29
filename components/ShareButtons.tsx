'use client'

import { useState } from 'react'
import { TestType } from '@/lib/tests'

interface ShareButtonsProps {
  percentile: number
  testType: TestType
}

const SHARE_COPY: Record<TestType, (percentile: number) => string> = {
  reaction: (percentile) => `I'm faster than ${percentile}% of people ? Can you beat me?`,
  memory: (percentile) => `My memory is better than ${percentile}% of people ?? Test yours:`,
  focus: (percentile) => `I'm more focused than ${percentile}% of people ?? Try it:`
}

export function ShareButtons({ percentile, testType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const text = `${SHARE_COPY[testType](percentile)} ${origin}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    if (typeof navigator === 'undefined') return
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    await navigator.clipboard.writeText(origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={handleShare}
        className="border border-accent bg-accent px-5 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:scale-[1.02]"
      >
        Share on X
      </button>
      <button
        onClick={handleCopy}
        className="border border-white/30 px-5 py-3 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:border-white"
      >
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
