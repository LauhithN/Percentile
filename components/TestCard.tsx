import Link from 'next/link'
import { TestType } from '@/lib/tests'

interface TestCardProps {
  id: TestType
  icon: string
  name: string
  description: string
  difficulty: number
  route: string
  tagline: string
  compact?: boolean
}

export function TestCard({ icon, name, description, difficulty, route, tagline, compact }: TestCardProps) {
  return (
    <div className="flex h-full flex-col justify-between border border-white/10 p-6">
      <div>
        <div className="text-3xl">{icon}</div>
        <h3 className="mt-4 text-xl font-semibold">{name}</h3>
        <p className="mt-2 text-sm text-white/70">{description}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">{tagline}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-white/50">
          {Array.from({ length: 3 }).map((_, index) => (
            <span key={index} className={index < difficulty ? 'text-white' : 'text-white/20'}>
              ?
            </span>
          ))}
        </div>
        <Link
          href={route}
          className={`border border-accent px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:scale-[1.02] ${compact ? 'bg-transparent' : 'bg-accent'}`}
        >
          Start Test ?
        </Link>
      </div>
    </div>
  )
}
