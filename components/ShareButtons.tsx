'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  percentile: number
}

export function ShareButtons({ percentile }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const text = `I'm faster than ${percentile}% of people ?? ${origin}`
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

