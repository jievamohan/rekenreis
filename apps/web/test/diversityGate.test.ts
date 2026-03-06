import { describe, test, expect } from 'vitest'
import type { Component } from 'vue'
import { checkDiversityGate, formatDiversityReport } from '~/utils/minigame/diversityGate'
import { useMinigame } from '~/composables/useMinigame'
import type { MinigameDefinition, MinigameContractV2, InteractionType, LayoutClass } from '~/types/minigame'

const stubComponent: () => Promise<Component> = () =>
  Promise.resolve({ render: () => null } as unknown as Component)

function makeDef(
  id: string,
  interactionType: InteractionType,
  layoutClass: LayoutClass,
  overrides?: Partial<MinigameContractV2>,
): MinigameDefinition {
  return {
    id: id as MinigameDefinition['id'],
    component: stubComponent,
    difficultyKnobs: {},
    contractV2: {
      interactionType,
      requiredInputs: ['pointer', 'keyboard'],
      timerPolicy: null,
      uniqueDifficultyKnobs: [
        { key: 'count', min: 1, max: 5, description: 'test' },
      ],
      layoutClass,
      isNew: false,
      ...overrides,
    },
  }
}

describe('diversity gate — distribution threshold', () => {
  test('passes when no single type reaches 60%', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'drag-drop', 'layout-dnd-dualzone'),
      makeDef('c', 'timed-pop', 'layout-pop-field'),
      makeDef('d', 'sort-into-bins', 'layout-sort-bins'),
      makeDef('e', 'build-sequence', 'layout-sequence-track'),
    ]
    const result = checkDiversityGate(defs)
    expect(result.pass).toBe(true)
    const distCheck = result.checks.find((c) => c.rule === 'distribution')
    expect(distCheck?.pass).toBe(true)
  })

  test('fails when one type is exactly 60% (3 of 5)', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-tap-scene'),
      makeDef('c', 'tap-choice', 'layout-pop-field'),
      makeDef('d', 'drag-drop', 'layout-dnd-dualzone'),
      makeDef('e', 'sort-into-bins', 'layout-sort-bins'),
    ]
    const result = checkDiversityGate(defs)
    expect(result.pass).toBe(false)
    const distCheck = result.checks.find((c) => c.rule === 'distribution')
    expect(distCheck?.pass).toBe(false)
    expect(distCheck?.offenders?.length).toBeGreaterThan(0)
  })

  test('passes at boundary: 2 of 4 = 50% (below 60%)', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-tap-scene'),
      makeDef('c', 'drag-drop', 'layout-dnd-dualzone'),
      makeDef('d', 'sort-into-bins', 'layout-sort-bins'),
    ]
    const result = checkDiversityGate(defs)
    const distCheck = result.checks.find((c) => c.rule === 'distribution')
    expect(distCheck?.pass).toBe(true)
  })

  test('fails when all minigames share same type', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-tap-scene'),
      makeDef('c', 'tap-choice', 'layout-pop-field'),
    ]
    const result = checkDiversityGate(defs)
    expect(result.pass).toBe(false)
  })

  test('reports correct offenders in output', () => {
    const defs = [
      makeDef('alpha', 'tap-choice', 'layout-float-field'),
      makeDef('beta', 'tap-choice', 'layout-tap-scene'),
      makeDef('gamma', 'tap-choice', 'layout-pop-field'),
      makeDef('delta', 'drag-drop', 'layout-dnd-dualzone'),
    ]
    const result = checkDiversityGate(defs)
    const distCheck = result.checks.find((c) => c.rule === 'distribution')
    expect(distCheck?.pass).toBe(false)
    expect(distCheck?.offenders?.[0]).toContain('alpha')
    expect(distCheck?.offenders?.[0]).toContain('beta')
    expect(distCheck?.offenders?.[0]).toContain('gamma')
  })
})

describe('diversity gate — duplication rule', () => {
  test('passes when no new minigames exist', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-float-field'),
    ]
    const result = checkDiversityGate(defs)
    const dupCheck = result.checks.find((c) => c.rule === 'duplication')
    expect(dupCheck?.pass).toBe(true)
  })

  test('fails when new minigame duplicates type+layout without justification', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-float-field', { isNew: true }),
    ]
    const result = checkDiversityGate(defs)
    const dupCheck = result.checks.find((c) => c.rule === 'duplication')
    expect(dupCheck?.pass).toBe(false)
    expect(dupCheck?.offenders?.[0]).toContain('b')
  })

  test('passes when new minigame has justification', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'tap-choice', 'layout-float-field', {
        isNew: true,
        duplicationJustification: 'Different visual metaphor',
      }),
    ]
    const result = checkDiversityGate(defs)
    const dupCheck = result.checks.find((c) => c.rule === 'duplication')
    expect(dupCheck?.pass).toBe(true)
  })

  test('passes when new minigame has different type or layout', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'drag-drop', 'layout-float-field', { isNew: true }),
    ]
    const result = checkDiversityGate(defs)
    const dupCheck = result.checks.find((c) => c.rule === 'duplication')
    expect(dupCheck?.pass).toBe(true)
  })
})

describe('diversity gate — contract completeness', () => {
  test('fails when definition is missing contractV2', () => {
    const def = {
      id: 'bubble-pop' as const,
      component: stubComponent,
      difficultyKnobs: {},
    } as unknown as MinigameDefinition
    const result = checkDiversityGate([def])
    const compCheck = result.checks.find((c) => c.rule === 'contract-completeness')
    expect(compCheck?.pass).toBe(false)
  })
})

describe('diversity gate — current registry', () => {
  const { getAllDefinitions } = useMinigame()
  const allDefs = getAllDefinitions()

  test('current registry passes diversity gate', () => {
    const result = checkDiversityGate(allDefs)
    expect(result.pass).toBe(true)
  })

  test('formatted report shows PASS', () => {
    const result = checkDiversityGate(allDefs)
    const report = formatDiversityReport(result)
    expect(report).toContain('PASS')
    expect(report).not.toContain('FAIL')
  })
})

describe('formatDiversityReport', () => {
  test('includes all check results', () => {
    const defs = [
      makeDef('a', 'tap-choice', 'layout-float-field'),
      makeDef('b', 'drag-drop', 'layout-dnd-dualzone'),
    ]
    const result = checkDiversityGate(defs)
    const report = formatDiversityReport(result)
    expect(report).toContain('contract-completeness')
    expect(report).toContain('distribution')
    expect(report).toContain('duplication')
  })

  test('includes offender details on failure', () => {
    const defs = [
      makeDef('alpha', 'tap-choice', 'layout-float-field'),
      makeDef('beta', 'tap-choice', 'layout-tap-scene'),
      makeDef('gamma', 'tap-choice', 'layout-pop-field'),
    ]
    const result = checkDiversityGate(defs)
    const report = formatDiversityReport(result)
    expect(report).toContain('FAIL')
    expect(report).toContain('alpha')
  })
})
