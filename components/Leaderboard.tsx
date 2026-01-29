const FAKE_SCORES = [
  { name: 'NeonPulse', time: 187, percentile: 98, date: 'Jan 29, 2026' },
  { name: 'ZeroLatency', time: 199, percentile: 96, date: 'Jan 29, 2026' },
  { name: 'QuickSilver', time: 204, percentile: 95, date: 'Jan 29, 2026' },
  { name: 'Blink', time: 212, percentile: 93, date: 'Jan 29, 2026' },
  { name: 'ArcFlash', time: 219, percentile: 92, date: 'Jan 29, 2026' },
  { name: 'GhostTap', time: 226, percentile: 90, date: 'Jan 29, 2026' },
  { name: 'NovaClick', time: 232, percentile: 88, date: 'Jan 29, 2026' },
  { name: 'PulsePeak', time: 238, percentile: 87, date: 'Jan 29, 2026' },
  { name: 'LightSpeed', time: 241, percentile: 86, date: 'Jan 29, 2026' },
  { name: 'JetLagged', time: 245, percentile: 85, date: 'Jan 29, 2026' }
]

export function Leaderboard() {
  return (
    <section id="leaderboard" className="mt-16 border border-white/10 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Leaderboard</p>
          <h2 className="mt-2 text-2xl">Top 10 lightning reflexes</h2>
        </div>
        <button
          disabled
          title="Coming soon"
          className="border border-accent px-5 py-3 text-xs uppercase tracking-[0.35em] text-white/40"
        >
          Login to save your score and track progress
        </button>
      </div>

      <div className="mt-8 overflow-x-auto border border-white/10">
        <div className="grid min-w-[520px] grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/50">
          <span>User</span>
          <span>Reaction</span>
          <span>Percentile</span>
          <span>Date</span>
        </div>
        {FAKE_SCORES.map((entry) => (
          <div
            key={entry.name}
            className="grid min-w-[520px] grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] border-b border-white/10 px-4 py-3 text-sm"
          >
            <span>{entry.name}</span>
            <span>{entry.time}ms</span>
            <span>{entry.percentile}%</span>
            <span className="text-white/60">{entry.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

