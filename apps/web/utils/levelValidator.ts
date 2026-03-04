import type { Level, PacingTag } from '~/types/level'

const VALID_MODE_IDS = ['classic', 'timed-pop', 'build-bridge'] as const
const VALID_PACING_TAGS: PacingTag[] = ['easy', 'normal', 'challenge']

export class LevelValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LevelValidationError'
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new LevelValidationError(message)
  }
}

/**
 * Validate a value as a Level. Throws LevelValidationError on invalid input.
 */
export function validateLevel(value: unknown): Level {
  assert(value !== null && typeof value === 'object', 'Level must be an object')
  const obj = value as Record<string, unknown>

  assert(obj.operator === 'addition', 'operator must be "addition"')

  assert(typeof obj.operandMin === 'number', 'operandMin must be a number')
  assert(Number.isInteger(obj.operandMin), 'operandMin must be an integer')
  assert(obj.operandMin >= 0, 'operandMin must be >= 0')

  assert(typeof obj.operandMax === 'number', 'operandMax must be a number')
  assert(Number.isInteger(obj.operandMax), 'operandMax must be an integer')
  assert(obj.operandMax >= 0, 'operandMax must be >= 0')
  assert(obj.operandMin <= obj.operandMax, 'operandMin must be <= operandMax')

  assert(typeof obj.choiceCount === 'number', 'choiceCount must be a number')
  assert(Number.isInteger(obj.choiceCount), 'choiceCount must be an integer')
  assert(obj.choiceCount >= 2 && obj.choiceCount <= 6, 'choiceCount must be 2-6')

  assert(typeof obj.hintMode === 'string', 'hintMode must be a string')
  assert(typeof obj.difficultyTag === 'string', 'difficultyTag must be a string')

  if (obj.masteryRules !== undefined) {
    assert(
      obj.masteryRules !== null && typeof obj.masteryRules === 'object' && !Array.isArray(obj.masteryRules),
      'masteryRules must be an object'
    )
  }

  if (obj.modeIds !== undefined) {
    assert(Array.isArray(obj.modeIds), 'modeIds must be an array')
    for (const id of obj.modeIds as unknown[]) {
      assert(typeof id === 'string', 'modeIds elements must be strings')
      assert(VALID_MODE_IDS.includes(id as (typeof VALID_MODE_IDS)[number]), `modeIds must be one of: ${VALID_MODE_IDS.join(', ')}`)
    }
  }

  if (obj.pacingTag !== undefined) {
    assert(typeof obj.pacingTag === 'string', 'pacingTag must be a string')
    assert(VALID_PACING_TAGS.includes(obj.pacingTag as PacingTag), `pacingTag must be one of: ${VALID_PACING_TAGS.join(', ')}`)
  }

  return {
    operator: 'addition',
    operandMin: obj.operandMin as number,
    operandMax: obj.operandMax as number,
    choiceCount: obj.choiceCount as number,
    hintMode: obj.hintMode as string,
    difficultyTag: obj.difficultyTag as string,
    masteryRules: obj.masteryRules as Record<string, unknown> | undefined,
    modeIds: obj.modeIds as Level['modeIds'],
    pacingTag: obj.pacingTag as PacingTag | undefined,
  }
}

/**
 * Safe validation; returns result object instead of throwing.
 */
export function parseLevel(
  value: unknown
): { success: true; data: Level } | { success: false; error: LevelValidationError } {
  try {
    const data = validateLevel(value)
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err as LevelValidationError }
  }
}
