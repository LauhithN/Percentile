import { TestType } from '@/lib/tests'

export type UserStats = {
  reaction?: { percentile: number; avgTime: number; completed: boolean }
  memory?: { percentile: number; longestSeq: number; completed: boolean }
  focus?: { percentile: number; accuracy: number; completed: boolean }
}

export type LastResult = {
  test: TestType
  percentile: number
  reaction?: { avg: number; times: number[] }
  memory?: { longestSequence: number; totalCorrect: number; avgSpeed: number }
  focus?: { blueHit: number; blueTotal: number; redHit: number; redTotal: number; avgSpeed: number }
}

const STATS_KEY = 'percentile:userStats'
const LAST_KEY = 'percentile:lastResult'

export function readUserStats(): UserStats {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STATS_KEY)
    return raw ? (JSON.parse(raw) as UserStats) : {}
  } catch {
    return {}
  }
}

export function updateUserStats(update: UserStats) {
  if (typeof window === 'undefined') return
  const current = readUserStats()
  const next: UserStats = { ...current, ...update }
  sessionStorage.setItem(STATS_KEY, JSON.stringify(next))
}

export function setLastResult(result: LastResult) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(LAST_KEY, JSON.stringify(result))
}

export function readLastResult(): LastResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(LAST_KEY)
    return raw ? (JSON.parse(raw) as LastResult) : null
  } catch {
    return null
  }
}
