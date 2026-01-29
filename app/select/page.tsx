import { Navbar } from '@/components/Navbar'
import { TestCard } from '@/components/TestCard'
import { TESTS } from '@/lib/tests'

export default function SelectPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Choose your test</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Pick a cognitive challenge</h1>
        <p className="mt-3 text-white/60">Each test takes under 45 seconds. No signup required.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTS.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>
      </section>
    </main>
  )
}
