import { Suspense } from 'react'
import { ResultsClient } from '@/components/ResultsClient'

export const dynamic = 'force-dynamic'

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-6 py-20 text-center text-sm uppercase tracking-[0.3em] text-white/60">
          Loading results...
        </main>
      }
    >
      <ResultsClient />
    </Suspense>
  )
}
