'use client'

import { Waitlist } from './Waitlist'

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Waitlist source="landing" variant="full" />

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
          <p className="text-xs uppercase tracking-[0.3em]">
            © 2026 Percentile. Built to humble you.
          </p>
          <div className="flex gap-8 text-xs uppercase tracking-[0.3em]">
            <a href="/waitlist" className="transition hover:text-white/70">
              Join Waitlist
            </a>
            <a href="/select" className="transition hover:text-white/70">
              All Tests
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
