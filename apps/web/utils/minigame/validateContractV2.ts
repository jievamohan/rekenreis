import type { MinigameDefinition, MinigameContractV2 } from '~/types/minigame'
import { INTERACTION_TYPES, REQUIRED_INPUTS, LAYOUT_CLASSES } from '~/types/minigame'

export interface ValidationError {
  minigameId: string
  field: string
  message: string
}

export function validateContractV2(def: MinigameDefinition): ValidationError[] {
  const errors: ValidationError[] = []
  const c = def.contractV2

  if (!c) {
    errors.push({ minigameId: def.id, field: 'contractV2', message: 'Missing contractV2 metadata' })
    return errors
  }

  if (!INTERACTION_TYPES.includes(c.interactionType)) {
    errors.push({
      minigameId: def.id,
      field: 'interactionType',
      message: `Invalid interactionType: ${c.interactionType}`,
    })
  }

  if (!Array.isArray(c.requiredInputs) || c.requiredInputs.length === 0) {
    errors.push({
      minigameId: def.id,
      field: 'requiredInputs',
      message: 'requiredInputs must be a non-empty array',
    })
  } else {
    for (const input of c.requiredInputs) {
      if (!REQUIRED_INPUTS.includes(input)) {
        errors.push({
          minigameId: def.id,
          field: 'requiredInputs',
          message: `Invalid requiredInput: ${input}`,
        })
      }
    }
  }

  if (!LAYOUT_CLASSES.includes(c.layoutClass)) {
    errors.push({
      minigameId: def.id,
      field: 'layoutClass',
      message: `Invalid layoutClass: ${c.layoutClass}`,
    })
  }

  if (!Array.isArray(c.uniqueDifficultyKnobs) || c.uniqueDifficultyKnobs.length === 0) {
    errors.push({
      minigameId: def.id,
      field: 'uniqueDifficultyKnobs',
      message: 'Must declare at least one uniqueDifficultyKnob',
    })
  } else {
    for (const knob of c.uniqueDifficultyKnobs) {
      if (!knob.key || typeof knob.min !== 'number' || typeof knob.max !== 'number') {
        errors.push({
          minigameId: def.id,
          field: 'uniqueDifficultyKnobs',
          message: `Invalid knob: ${knob.key ?? '(unnamed)'}`,
        })
      }
      if (knob.min > knob.max) {
        errors.push({
          minigameId: def.id,
          field: 'uniqueDifficultyKnobs',
          message: `Knob ${knob.key}: min (${knob.min}) > max (${knob.max})`,
        })
      }
    }
  }

  validateTimerPolicy(def.id, c, errors)

  if (c.isNew && (!c.duplicationJustification || c.duplicationJustification.trim() === '')) {
    // Duplication justification only required if another minigame shares interactionType + layoutClass
    // This is checked at the collection level, not per-minigame
  }

  return errors
}

function validateTimerPolicy(
  minigameId: string,
  c: MinigameContractV2,
  errors: ValidationError[],
): void {
  if (c.timerPolicy === null) return

  if (c.timerPolicy.timeoutBehavior !== 'hint-continue') {
    errors.push({
      minigameId,
      field: 'timerPolicy.timeoutBehavior',
      message: `Timeout behavior must be 'hint-continue', got: ${c.timerPolicy.timeoutBehavior}`,
    })
  }

  if (!['degrade', 'disable'].includes(c.timerPolicy.reducedMotionBehavior)) {
    errors.push({
      minigameId,
      field: 'timerPolicy.reducedMotionBehavior',
      message: `Invalid reducedMotionBehavior: ${c.timerPolicy.reducedMotionBehavior}`,
    })
  }
}

export function validateAllContracts(defs: MinigameDefinition[]): ValidationError[] {
  const errors: ValidationError[] = []

  for (const def of defs) {
    errors.push(...validateContractV2(def))
  }

  // Collection-level: check isNew duplicates
  for (const def of defs) {
    if (!def.contractV2?.isNew) continue
    const dupes = defs.filter(
      (d) =>
        d.id !== def.id &&
        d.contractV2 &&
        d.contractV2.interactionType === def.contractV2.interactionType &&
        d.contractV2.layoutClass === def.contractV2.layoutClass,
    )
    if (dupes.length > 0 && (!def.contractV2.duplicationJustification || def.contractV2.duplicationJustification.trim() === '')) {
      errors.push({
        minigameId: def.id,
        field: 'duplicationJustification',
        message: `New minigame shares interactionType+layoutClass with ${dupes.map((d) => d.id).join(', ')} but has no duplicationJustification`,
      })
    }
  }

  return errors
}
