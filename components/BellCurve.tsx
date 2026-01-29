'use client'

interface BellCurveProps {
  percentile: number
  leftLabel?: string
  rightLabel?: string
  accent?: string
}

export function BellCurve({ percentile, leftLabel = 'Low', rightLabel = 'High', accent = '#0066FF' }: BellCurveProps) {
  const width = 520
  const height = 220
  const center = width / 2
  const sigma = width / 6
  const amplitude = 120

  const points: string[] = []
  const steps = 80

  for (let i = 0; i <= steps; i += 1) {
    const x = (i / steps) * width
    const z = (x - center) / sigma
    const y = height - Math.exp(-(z * z) / 2) * amplitude - 20
    points.push(`${x},${y}`)
  }

  const path = `M ${points[0]} L ${points.slice(1).join(' ')}`
  const markerX = (percentile / 100) * width

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Distribution</p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-6 h-40 w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curve" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke="url(#curve)" strokeWidth="3" />
        <line x1={markerX} y1={20} x2={markerX} y2={height - 10} stroke={accent} strokeWidth="2" />
        <circle cx={markerX} cy={height - 20} r="6" fill={accent} />
      </svg>
      <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-white/40">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
