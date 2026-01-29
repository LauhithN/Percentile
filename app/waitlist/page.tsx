import { Navbar } from '@/components/Navbar'
import { Waitlist } from '@/components/Waitlist'

export const metadata = {
  title: 'Join Waitlist - Percentile',
  description: 'Get early access to premium cognitive testing features.'
}

export default function WaitlistPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-12">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Premium Access</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            Ready to level up your brain?
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Join the waitlist for exclusive early access to advanced features.
          </p>
        </div>

        <Waitlist source="waitlist_page" variant="full" />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="border border-white/10 p-6">
            <div className="text-2xl">📊</div>
            <h3 className="mt-4 text-lg font-semibold">Advanced Analytics</h3>
            <p className="mt-2 text-sm text-white/60">
              Track your progress over time. Identify strengths and weaknesses with detailed breakdowns.
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <div className="text-2xl">🎯</div>
            <h3 className="mt-4 text-lg font-semibold">Custom Training</h3>
            <p className="mt-2 text-sm text-white/60">
              Personalized difficulty levels. Train specific cognitive areas. Set your own challenge.
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <div className="text-2xl">🏆</div>
            <h3 className="mt-4 text-lg font-semibold">Compete Globally</h3>
            <p className="mt-2 text-sm text-white/60">
              Real-time leaderboards. Challenge friends. Prove you&apos;re in the top 1%.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Launch Timeline
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-white/40">Phase 1</p>
              <p className="mt-2 text-xl font-semibold">Q1 2026</p>
              <p className="mt-1 text-sm text-white/60">Beta Launch</p>
            </div>
            <div>
              <p className="text-sm text-white/40">Phase 2</p>
              <p className="mt-2 text-xl font-semibold">Q2 2026</p>
              <p className="mt-1 text-sm text-white/60">Premium Features</p>
            </div>
            <div>
              <p className="text-sm text-white/40">Phase 3</p>
              <p className="mt-2 text-xl font-semibold">Q3 2026</p>
              <p className="mt-1 text-sm text-white/60">Public Release</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
