/**
 * Maatje avatar matrix: character × expression → asset path.
 * Paths are relative to public root (e.g. /graphics/characters/maatjes/...).
 */

import type { ExpressionId, MaatjeId } from '~/types/maatje'

const BASE = '/graphics/characters/maatjes'

export const MAATJE_MATRIX: Record<
  MaatjeId,
  Partial<Record<ExpressionId, string>>
> = {
  wolkje: {
    blij: `${BASE}/wolkje/blij.png`,
    neutraal: `${BASE}/wolkje/neutraal.png`,
    verdrietig: `${BASE}/wolkje/verdrietig.png`,
    nadenken: `${BASE}/wolkje/nadenken.png`,
  },
  'een-oog-eerlijk': {
    blij: `${BASE}/een-oog-eerlijk/blij.png`,
    feest: `${BASE}/een-oog-eerlijk/feest.png`,
    neutraal: `${BASE}/een-oog-eerlijk/neutraal.png`,
    verrast: `${BASE}/een-oog-eerlijk/verrast.png`,
    verdrietig: `${BASE}/een-oog-eerlijk/verdrietig.png`,
    nadenken: `${BASE}/een-oog-eerlijk/nadenken.png`,
  },
  'slimme-rekenaar': {
    blij: `${BASE}/slimme-rekenaar/blij.png`,
    feest: `${BASE}/slimme-rekenaar/feest.png`,
    verdrietig: `${BASE}/slimme-rekenaar/verdrietig.png`,
    nadenken: `${BASE}/slimme-rekenaar/nadenken.png`,
  },
}
