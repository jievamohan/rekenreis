import type { MinigameDefinition, InteractionType } from '~/types/minigame'

export interface DiversityResult {
  pass: boolean
  checks: DiversityCheck[]
}

export interface DiversityCheck {
  rule: string
  pass: boolean
  message: string
  offenders?: string[]
}

const DISTRIBUTION_THRESHOLD = 0.6

export function checkDiversityGate(defs: MinigameDefinition[]): DiversityResult {
  const checks: DiversityCheck[] = []

  checks.push(checkContractCompleteness(defs))
  checks.push(checkDistribution(defs))
  checks.push(checkDuplication(defs))

  return {
    pass: checks.every((c) => c.pass),
    checks,
  }
}

function checkContractCompleteness(defs: MinigameDefinition[]): DiversityCheck {
  const missing = defs.filter((d) => !d.contractV2)
  if (missing.length > 0) {
    return {
      rule: 'contract-completeness',
      pass: false,
      message: `${missing.length} minigame(s) missing contractV2 metadata`,
      offenders: missing.map((d) => d.id),
    }
  }
  return {
    rule: 'contract-completeness',
    pass: true,
    message: 'All minigames have contractV2 metadata',
  }
}

function checkDistribution(defs: MinigameDefinition[]): DiversityCheck {
  const enabledDefs = defs.filter((d) => d.contractV2)
  const total = enabledDefs.length
  if (total === 0) {
    return {
      rule: 'distribution',
      pass: true,
      message: 'No enabled minigames to check',
    }
  }

  const counts = new Map<InteractionType, string[]>()
  for (const def of enabledDefs) {
    const type = def.contractV2.interactionType
    const existing = counts.get(type) ?? []
    existing.push(def.id)
    counts.set(type, existing)
  }

  const violations: string[] = []
  for (const [type, ids] of counts) {
    const ratio = ids.length / total
    if (ratio >= DISTRIBUTION_THRESHOLD) {
      violations.push(
        `${type}: ${ids.length}/${total} (${(ratio * 100).toFixed(0)}%) — [${ids.join(', ')}]`
      )
    }
  }

  if (violations.length > 0) {
    return {
      rule: 'distribution',
      pass: false,
      message: `interactionType distribution exceeds ${DISTRIBUTION_THRESHOLD * 100}% threshold`,
      offenders: violations,
    }
  }

  return {
    rule: 'distribution',
    pass: true,
    message: `No interactionType exceeds ${DISTRIBUTION_THRESHOLD * 100}% threshold (${total} enabled)`,
  }
}

function checkDuplication(defs: MinigameDefinition[]): DiversityCheck {
  const enabledDefs = defs.filter((d) => d.contractV2)
  const violations: string[] = []

  for (const def of enabledDefs) {
    if (!def.contractV2.isNew) continue

    const dupes = enabledDefs.filter(
      (d) =>
        d.id !== def.id &&
        d.contractV2 &&
        d.contractV2.interactionType === def.contractV2.interactionType &&
        d.contractV2.layoutClass === def.contractV2.layoutClass,
    )

    if (
      dupes.length > 0 &&
      (!def.contractV2.duplicationJustification ||
        def.contractV2.duplicationJustification.trim() === '')
    ) {
      violations.push(
        `${def.id} (new) duplicates interactionType+layoutClass of [${dupes.map((d) => d.id).join(', ')}] without justification`
      )
    }
  }

  if (violations.length > 0) {
    return {
      rule: 'duplication',
      pass: false,
      message: 'New minigame(s) duplicate interactionType+layoutClass without justification',
      offenders: violations,
    }
  }

  return {
    rule: 'duplication',
    pass: true,
    message: 'No unjustified duplicate interactionType+layoutClass pairs',
  }
}

export function formatDiversityReport(result: DiversityResult): string {
  const lines: string[] = []
  lines.push(result.pass ? '✅ Diversity Gate: PASS' : '❌ Diversity Gate: FAIL')
  lines.push('')

  for (const check of result.checks) {
    const icon = check.pass ? '✅' : '❌'
    lines.push(`${icon} [${check.rule}] ${check.message}`)
    if (check.offenders) {
      for (const offender of check.offenders) {
        lines.push(`   → ${offender}`)
      }
    }
  }

  return lines.join('\n')
}
