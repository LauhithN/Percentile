'use client'

import { useState } from 'react'

type WaitlistProps = {
  source: 'results' | 'landing' | 'waitlist_page'
  variant?: 'compact' | 'full'
  className?: string
}

export function Waitlist({ source, variant = 'full', className = '' }: WaitlistProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to join waitlist')
        return
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`border border-green-500/20 bg-green-500/5 p-6 text-center ${className}`}>
        <div className="text-2xl">✓</div>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-green-400">
          You&apos;re on the list!
        </p>
        <p className="mt-2 text-xs text-white/60">We&apos;ll notify you when premium features launch.</p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`border border-accent/20 bg-accent/5 p-6 ${className}`}>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">Premium Features Coming</p>
        <h3 className="mt-2 text-xl font-semibold">Join the waitlist</h3>
        <p className="mt-2 text-sm text-white/70">
          Get early access to advanced analytics, custom training modes, and progress tracking.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="border border-accent bg-accent px-6 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:scale-[1.02] disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>
        {status === 'error' && (
          <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`border border-accent/20 bg-accent/5 p-8 md:p-12 ${className}`}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Premium Features</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Get Early Access</h2>
        <p className="mt-4 text-white/70">
          Be the first to try advanced analytics, custom difficulty modes, detailed progress tracking, and
          competitive leaderboards.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-white/20 bg-white/5 px-6 py-4 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="border border-accent bg-accent px-8 py-4 text-sm uppercase tracking-[0.35em] text-white transition hover:scale-[1.02] disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
        )}
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
          No spam. Launch updates only.
        </p>
      </div>
    </div>
  )
}
