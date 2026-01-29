export function calculateReactionPercentile(avgReactionTime: number) {
  const mean = 273
  const stdDev = 51

  const zScore = (mean - avgReactionTime) / stdDev
  const percentile = Math.round(cdf(zScore) * 100)

  return Math.max(1, Math.min(99, percentile))
}

export function calculatePercentile(avgReactionTime: number) {
  return calculateReactionPercentile(avgReactionTime)
}

export function calculateMemoryPercentile(longestSequence: number, totalCorrect: number, avgSpeed: number) {
  const sequenceScore = (longestSequence - 3) / 4
  const accuracyScore = totalCorrect / 25
  const speedScore = Math.max(0, 1 - (avgSpeed - 800) / 1200)

  const compositeScore = sequenceScore * 0.6 + accuracyScore * 0.3 + speedScore * 0.1

  const mean = 0.5
  const stdDev = 0.18
  const zScore = (compositeScore - mean) / stdDev
  const percentile = Math.round(cdf(zScore) * 100)

  return Math.max(1, Math.min(99, percentile))
}

export function calculateFocusPercentile(
  blueHit: number,
  blueTotal: number,
  redHit: number,
  redTotal: number,
  avgSpeed: number
) {
  const safeBlueTotal = Math.max(1, blueTotal)
  const safeRedTotal = Math.max(1, redTotal)
  const blueAccuracy = blueHit / safeBlueTotal
  const redAccuracy = (safeRedTotal - redHit) / safeRedTotal
  const overallAccuracy = blueAccuracy * 0.7 + redAccuracy * 0.3

  const speedScore = Math.max(0, 1 - (avgSpeed - 400) / 600)
  const compositeScore = overallAccuracy * 0.85 + speedScore * 0.15

  const mean = 0.65
  const stdDev = 0.15
  const zScore = (compositeScore - mean) / stdDev
  const percentile = Math.round(cdf(zScore) * 100)

  return Math.max(1, Math.min(99, percentile))
}

export function cdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return z > 0 ? 1 - prob : prob
}
