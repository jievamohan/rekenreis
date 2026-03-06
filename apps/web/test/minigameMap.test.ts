import { describe, test, expect } from 'vitest'
import minigameMapData from '~/content/minigame-map.v1.json'
import { MINIGAME_IDS } from '~/types/minigame'
import type { MinigameMap, MinigameId } from '~/types/minigame'

const map = minigameMapData as unknown as MinigameMap

describe('minigame-map.v1.json validation', () => {
  test('has version 1', () => {
    expect(map.version).toBe(1)
  })

  test('has default entry', () => {
    expect(map.defaultEntry).toBeDefined()
    expect(map.defaultEntry.type).toBe('weighted')
  })

  test('has rules array', () => {
    expect(Array.isArray(map.rules)).toBe(true)
    expect(map.rules.length).toBeGreaterThan(0)
  })

  test('all minigameIds in rules are valid', () => {
    const validIds = new Set<string>(MINIGAME_IDS)

    for (const rule of map.rules) {
      if (rule.entry.type === 'direct') {
        expect(validIds.has(rule.entry.minigameId), `Invalid id: ${rule.entry.minigameId}`).toBe(true)
      } else {
        for (const p of rule.entry.pool) {
          expect(validIds.has(p.minigameId), `Invalid id: ${p.minigameId}`).toBe(true)
        }
      }
    }
  })

  test('all minigameIds in default entry are valid', () => {
    const validIds = new Set<string>(MINIGAME_IDS)
    if (map.defaultEntry.type === 'weighted') {
      for (const p of map.defaultEntry.pool) {
        expect(validIds.has(p.minigameId)).toBe(true)
      }
    }
  })

  test('rules cover non-overlapping level ranges', () => {
    const sorted = [...map.rules].sort((a, b) => a.levelMin - b.levelMin)
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].levelMin).toBeGreaterThan(sorted[i - 1].levelMax)
    }
  })

  test('weights are positive', () => {
    function checkEntry(entry: { type: string; pool?: Array<{ weight: number }> }) {
      if (entry.type === 'weighted' && entry.pool) {
        for (const p of entry.pool) {
          expect(p.weight).toBeGreaterThan(0)
        }
      }
    }
    checkEntry(map.defaultEntry)
    for (const rule of map.rules) {
      checkEntry(rule.entry)
    }
  })

  test('default entry covers all 6 minigames', () => {
    if (map.defaultEntry.type === 'weighted') {
      const ids = new Set(map.defaultEntry.pool.map((p) => p.minigameId as MinigameId))
      for (const id of MINIGAME_IDS) {
        expect(ids.has(id), `Missing in default: ${id}`).toBe(true)
      }
    }
  })

  test('levels 1 to 100 have explicit direct minigame mapping', () => {
    for (let level = 1; level <= 100; level++) {
      const rule = map.rules.find((r) => level >= r.levelMin && level <= r.levelMax)
      expect(rule, `Missing rule for level ${level}`).toBeDefined()
      expect(rule!.entry.type, `Level ${level} should use direct mapping`).toBe('direct')
      expect(rule!.levelMin).toBe(level)
      expect(rule!.levelMax).toBe(level)
    }
  })
})
