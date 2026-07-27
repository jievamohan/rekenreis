import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useProgressSync } from '../composables/useProgressSync'
import type { ProfileSchemaV1 } from '../utils/profileSchema'

const fetchProgress = vi.fn()
const putProgress = vi.fn()

vi.mock('../utils/api', () => ({
  fetchProgress: (...args: unknown[]) => fetchProgress(...args),
  putProgress: (...args: unknown[]) => putProgress(...args),
}))

function validSchema(currentLevel = 3): ProfileSchemaV1 {
  return {
    version: 1,
    activeProfileId: 'p1',
    profiles: [
      {
        id: 'p1',
        name: 'Kid',
        avatarId: 'default',
        maatjeId: 'wolkje',
        progress: {
          bestScore: 0,
          currentLevel,
          levelProgress: { 1: { stars: 3 }, 2: { stars: 2 } },
        },
        prefs: {
          lastMode: 'classic',
          lastSkin: 'classic',
          difficultyCeiling: 'upTo10',
          hintsOn: true,
          soundOn: true,
          timersDisabled: false,
        },
        telemetryOptOut: true,
      },
    ],
  }
}

describe('useProgressSync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    fetchProgress.mockReset()
    putProgress.mockReset()
    putProgress.mockResolvedValue({ progress: {} })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hydrates valid progress into schema and allows PUT after ready', async () => {
    const remote = validSchema(5)
    fetchProgress.mockResolvedValue({ progress: remote })
    const schema = ref<ProfileSchemaV1 | undefined>(validSchema(1))
    const { fetchAndHydrate, saveToApi } = useProgressSync(
      schema,
      '',
      () => true,
      () => ({ name: 'Kid' })
    )

    await fetchAndHydrate()
    expect(schema.value?.profiles[0]?.progress.currentLevel).toBe(5)

    saveToApi(schema.value)
    await vi.advanceTimersByTimeAsync(500)
    expect(putProgress).toHaveBeenCalledTimes(1)
  })

  it('keeps valid local schema when API progress is empty', async () => {
    fetchProgress.mockResolvedValue({ progress: [] })
    const prior = validSchema(7)
    const schema = ref<ProfileSchemaV1 | undefined>(prior)
    const { fetchAndHydrate } = useProgressSync(
      schema,
      '',
      () => true,
      () => ({ name: 'Kid' })
    )

    await fetchAndHydrate()
    expect(schema.value?.profiles[0]?.progress.currentLevel).toBe(7)
    // flush immediate PUT after hydrate ready (mutations during hydrate were gated)
    expect(putProgress).toHaveBeenCalledTimes(1)
  })

  it('does not wipe schema or PUT when fetch fails', async () => {
    fetchProgress.mockRejectedValue(new Error('network'))
    const prior = validSchema(7)
    const schema = ref<ProfileSchemaV1 | undefined>(prior)
    const { fetchAndHydrate, saveToApi } = useProgressSync(
      schema,
      '',
      () => true,
      () => ({ name: 'Kid' })
    )

    await fetchAndHydrate()
    expect(schema.value?.profiles[0]?.progress.currentLevel).toBe(7)

    saveToApi(schema.value)
    await vi.advanceTimersByTimeAsync(500)
    expect(putProgress).not.toHaveBeenCalled()
  })
})
