import { describe, test, expect } from 'vitest'
import type { Component } from 'vue'
import { validateContractV2, validateAllContracts } from '~/utils/minigame/validateContractV2'
import { useMinigame } from '~/composables/useMinigame'
import { INTERACTION_TYPES, LAYOUT_CLASSES, REQUIRED_INPUTS } from '~/types/minigame'
import type { MinigameDefinition, MinigameContractV2, InteractionType, RequiredInput, LayoutClass } from '~/types/minigame'

const stubComponent: () => Promise<Component> = () => Promise.resolve({ render: () => null } as unknown as Component)

function makeDef(overrides: Partial<MinigameDefinition> & { contractV2: MinigameContractV2 }): MinigameDefinition {
  return {
    id: 'bubble-pop',
    component: stubComponent,
    difficultyKnobs: {},
    ...overrides,
  }
}

function makeValidContract(overrides?: Partial<MinigameContractV2>): MinigameContractV2 {
  return {
    interactionType: 'tap-choice',
    requiredInputs: ['pointer', 'keyboard'],
    timerPolicy: null,
    uniqueDifficultyKnobs: [
      { key: 'count', min: 1, max: 5, description: 'test knob' },
    ],
    layoutClass: 'layout-float-field',
    isNew: false,
    ...overrides,
  }
}

describe('validateContractV2', () => {
  test('valid contract produces no errors', () => {
    const def = makeDef({ contractV2: makeValidContract() })
    expect(validateContractV2(def)).toEqual([])
  })

  test('rejects invalid interactionType', () => {
    const def = makeDef({
      contractV2: makeValidContract({ interactionType: 'invalid' as unknown as InteractionType }),
    })
    const errors = validateContractV2(def)
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe('interactionType')
  })

  test('rejects empty requiredInputs', () => {
    const def = makeDef({
      contractV2: makeValidContract({ requiredInputs: [] }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.field === 'requiredInputs')).toBe(true)
  })

  test('rejects invalid requiredInput value', () => {
    const def = makeDef({
      contractV2: makeValidContract({ requiredInputs: ['invalid' as unknown as RequiredInput] }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.field === 'requiredInputs')).toBe(true)
  })

  test('rejects invalid layoutClass', () => {
    const def = makeDef({
      contractV2: makeValidContract({ layoutClass: 'bad-layout' as unknown as LayoutClass }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.field === 'layoutClass')).toBe(true)
  })

  test('rejects empty uniqueDifficultyKnobs', () => {
    const def = makeDef({
      contractV2: makeValidContract({ uniqueDifficultyKnobs: [] }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.field === 'uniqueDifficultyKnobs')).toBe(true)
  })

  test('rejects knob with min > max', () => {
    const def = makeDef({
      contractV2: makeValidContract({
        uniqueDifficultyKnobs: [{ key: 'x', min: 10, max: 2, description: 'bad' }],
      }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.message.includes('min'))).toBe(true)
  })

  test('rejects timerPolicy with wrong timeoutBehavior', () => {
    const def = makeDef({
      contractV2: makeValidContract({
        timerPolicy: {
          enabledByDefault: true,
          allowDisableInSettings: true,
          timeoutBehavior: 'fail' as unknown as 'hint-continue',
          reducedMotionBehavior: 'degrade',
        },
      }),
    })
    const errors = validateContractV2(def)
    expect(errors.some((e) => e.field === 'timerPolicy.timeoutBehavior')).toBe(true)
  })

  test('null timerPolicy is valid', () => {
    const def = makeDef({ contractV2: makeValidContract({ timerPolicy: null }) })
    expect(validateContractV2(def)).toEqual([])
  })
})

describe('validateAllContracts', () => {
  test('detects new minigame with duplicate interactionType+layoutClass without justification', () => {
    const defs = [
      makeDef({ id: 'bubble-pop', contractV2: makeValidContract({ isNew: false }) }),
      makeDef({
        id: 'memory-match',
        contractV2: makeValidContract({ isNew: true }),
      }),
    ]
    const errors = validateAllContracts(defs)
    expect(errors.some((e) => e.field === 'duplicationJustification')).toBe(true)
  })

  test('allows new minigame with duplicate when justification provided', () => {
    const defs = [
      makeDef({ id: 'bubble-pop', contractV2: makeValidContract({ isNew: false }) }),
      makeDef({
        id: 'memory-match',
        contractV2: makeValidContract({
          isNew: true,
          duplicationJustification: 'Different visual metaphor and scene composition',
        }),
      }),
    ]
    const errors = validateAllContracts(defs)
    expect(errors.filter((e) => e.field === 'duplicationJustification')).toHaveLength(0)
  })

  test('allows new minigame with different interactionType+layoutClass', () => {
    const defs = [
      makeDef({ id: 'bubble-pop', contractV2: makeValidContract({ isNew: false }) }),
      makeDef({
        id: 'treasure-dive',
        contractV2: makeValidContract({
          isNew: true,
          interactionType: 'drag-drop',
          layoutClass: 'layout-dnd-dualzone',
        }),
      }),
    ]
    const errors = validateAllContracts(defs)
    expect(errors.filter((e) => e.field === 'duplicationJustification')).toHaveLength(0)
  })
})

describe('registry Contract v2 completeness', () => {
  const { getAllDefinitions } = useMinigame()
  const allDefs = getAllDefinitions()

  test('all 6 minigames are registered', () => {
    expect(allDefs).toHaveLength(6)
  })

  test('all registered minigames have valid contractV2 metadata', () => {
    const errors = validateAllContracts(allDefs)
    expect(errors).toEqual([])
  })

  test('all interactionType values are from allowed enum', () => {
    for (const def of allDefs) {
      expect(INTERACTION_TYPES).toContain(def.contractV2.interactionType)
    }
  })

  test('all layoutClass values are from allowed enum', () => {
    for (const def of allDefs) {
      expect(LAYOUT_CLASSES).toContain(def.contractV2.layoutClass)
    }
  })

  test('all requiredInputs values are from allowed enum', () => {
    for (const def of allDefs) {
      for (const input of def.contractV2.requiredInputs) {
        expect(REQUIRED_INPUTS).toContain(input)
      }
    }
  })

  test('each minigame has at least one uniqueDifficultyKnob', () => {
    for (const def of allDefs) {
      expect(def.contractV2.uniqueDifficultyKnobs.length).toBeGreaterThanOrEqual(1)
    }
  })

  test('timed minigames have timerPolicy with hint-continue', () => {
    for (const def of allDefs) {
      if (def.contractV2.timerPolicy) {
        expect(def.contractV2.timerPolicy.timeoutBehavior).toBe('hint-continue')
        expect(def.contractV2.timerPolicy.allowDisableInSettings).toBe(true)
      }
    }
  })

  test('memory-match is registered with memory-flip interaction', () => {
    const def = allDefs.find((d) => d.id === 'memory-match')
    expect(def).toBeDefined()
    expect(def!.contractV2.interactionType).toBe('memory-flip')
    expect(def!.contractV2.layoutClass).toBe('layout-match-grid')
  })

  test('no two minigames share both interactionType and layoutClass', () => {
    const seen = new Set<string>()
    for (const def of allDefs) {
      const key = `${def.contractV2.interactionType}:${def.contractV2.layoutClass}`
      expect(seen.has(key), `Duplicate interactionType+layoutClass: ${key} on ${def.id}`).toBe(false)
      seen.add(key)
    }
  })
})
