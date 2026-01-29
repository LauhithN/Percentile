export type TestType = 'reaction' | 'memory' | 'focus'

export const TESTS: Array<{
  id: TestType
  name: string
  icon: string
  description: string
  difficulty: number
  route: string
  tagline: string
}> = [
  {
    id: 'reaction',
    name: 'Reaction Speed',
    icon: '?',
    description: 'How fast can you react to changes?',
    difficulty: 1,
    route: '/test/reaction',
    tagline: 'Tests your reflex speed'
  },
  {
    id: 'memory',
    name: 'Memory Sequence',
    icon: '??',
    description: 'Remember and repeat the sequence.',
    difficulty: 2,
    route: '/test/memory',
    tagline: 'Tests your short-term memory'
  },
  {
    id: 'focus',
    name: 'Focus & Accuracy',
    icon: '??',
    description: 'Tap only the blue targets.',
    difficulty: 2,
    route: '/test/focus',
    tagline: 'Tests your selective attention'
  }
]

export function getTestById(id: string | null | undefined) {
  return TESTS.find((test) => test.id === id) ?? TESTS[0]
}
