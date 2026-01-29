export function calculatePercentile(avgReactionTime: number) {
  const mean = 273
  const stdDev = 51

  const zScore = (mean - avgReactionTime) / stdDev
  const percentile = Math.round(cdf(zScore) * 100)

  return Math.max(1, Math.min(99, percentile))
}

export function cdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - prob : prob
}

