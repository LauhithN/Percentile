import Link from 'next/link'

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link href="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
        Percentile
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <button
          disabled
          title="Coming soon"
          className="border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50"
        >
          Login
        </button>
      </div>
    </header>
  )
}

