/**
 * Composable to resolve maatje avatar asset path with fallback chain.
 * Fallback: requested expression → blij → neutraal → first available.
 */

import { MAATJE_MATRIX } from '~/content/maatje-matrix'
import type { ExpressionId, MaatjeId } from '~/types/maatje'

const FALLBACK_CHAIN: ExpressionId[] = ['blij', 'neutraal']

export function useMaatje() {
  function resolve(character: MaatjeId, expression: ExpressionId): string {
    const charMap = MAATJE_MATRIX[character]
    if (!charMap) return ''

    // Direct match
    const direct = charMap[expression]
    if (direct) return direct

    // Fallback chain
    for (const fallback of FALLBACK_CHAIN) {
      const path = charMap[fallback]
      if (path) return path
    }

    // First available
    const first = Object.values(charMap)[0]
    return first ?? ''
  }

  return { resolve }
}
