import { describe, it, expect } from 'vitest'
import { useMaatje } from '../composables/useMaatje'

describe('useMaatje', () => {
  const { resolve } = useMaatje()

  it('resolves direct match for wolkje + blij', () => {
    expect(resolve('wolkje', 'blij')).toBe('/graphics/characters/maatjes/wolkje/blij.png')
  })

  it('resolves direct match for een-oog-eerlijk + feest', () => {
    expect(resolve('een-oog-eerlijk', 'feest')).toBe(
      '/graphics/characters/maatjes/een-oog-eerlijk/feest.png'
    )
  })

  it('resolves direct match for slimme-rekenaar + nadenken', () => {
    expect(resolve('slimme-rekenaar', 'nadenken')).toBe(
      '/graphics/characters/maatjes/slimme-rekenaar/nadenken.png'
    )
  })

  it('fallback when expression missing: slimme-rekenaar has no neutraal, falls back to blij', () => {
    // slimme-rekenaar has: blij, feest, verdrietig, nadenken (no neutraal, no verrast)
    const result = resolve('slimme-rekenaar', 'verrast')
    expect(result).toBe('/graphics/characters/maatjes/slimme-rekenaar/blij.png')
  })

  it('fallback when expression missing: slimme-rekenaar + neutraal → blij', () => {
    const result = resolve('slimme-rekenaar', 'neutraal')
    expect(result).toBe('/graphics/characters/maatjes/slimme-rekenaar/blij.png')
  })

  it('fallback chain: wolkje has no feest, falls back to blij', () => {
    const result = resolve('wolkje', 'feest')
    expect(result).toBe('/graphics/characters/maatjes/wolkje/blij.png')
  })

  it('returns valid path for all character × expression combinations in matrix', () => {
    const characters = ['wolkje', 'een-oog-eerlijk', 'slimme-rekenaar'] as const
    const expressions = ['blij', 'neutraal', 'verdrietig', 'nadenken', 'feest', 'verrast'] as const
    for (const char of characters) {
      for (const expr of expressions) {
        const path = resolve(char, expr)
        expect(path).toMatch(/^\/graphics\/characters\/maatjes\/.+\/.+\.png$/)
      }
    }
  })
})
