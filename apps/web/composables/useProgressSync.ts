import type { Ref } from 'vue'
import { fetchProgress, putProgress } from '~/utils/api'
import {
  createSchemaForUser,
  isValidV1,
  type ProfileSchemaV1,
} from '~/utils/profileSchema'

const DEBOUNCE_MS = 500

function isEmptyProgress(progress: unknown): boolean {
  if (progress == null) return true
  if (Array.isArray(progress)) return progress.length === 0
  if (typeof progress === 'object') return Object.keys(progress as object).length === 0
  return false
}

export function useProgressSync(
  schemaRef: Ref<ProfileSchemaV1 | undefined>,
  apiUrl: string,
  isAuthenticated: () => boolean,
  user: () => { name: string } | null
) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  /** Only allow PUT after a successful hydrate (valid, empty bootstrap, or keep-local). */
  let hydrateReady = false

  function saveToApi(data: ProfileSchemaV1 | undefined, immediate = false) {
    if (!hydrateReady || !isAuthenticated() || !data) return
    clearTimeout(debounceTimer!)
    const run = async () => {
      try {
        await putProgress(apiUrl, data as unknown as Record<string, unknown>)
      } catch {
        // ignore; will retry on next change
      } finally {
        debounceTimer = null
      }
    }
    if (immediate) {
      void run()
      return
    }
    debounceTimer = setTimeout(run, DEBOUNCE_MS)
  }

  async function fetchAndHydrate() {
    const u = user()
    if (!u) return
    hydrateReady = false
    try {
      const { progress } = await fetchProgress(apiUrl)
      if (isEmptyProgress(progress)) {
        // Keep valid in-memory/LS schema (e.g. play progress before hydrate finished); else bootstrap.
        if (!(schemaRef.value && isValidV1(schemaRef.value))) {
          schemaRef.value = createSchemaForUser(u.name)
        }
        hydrateReady = true
        // Flush: mutations during hydrating were skipped by the gate
        saveToApi(schemaRef.value, true)
        return
      }
      if (!isValidV1(progress)) {
        // Keep last-known schema; never PUT defaults over a bad/unknown blob
        return
      }
      schemaRef.value = createSchemaForUser(u.name, progress)
      hydrateReady = true
    } catch {
      // Keep last-known schema; do not mark ready (blocks wipe PUT)
    }
  }

  return {
    fetchAndHydrate,
    saveToApi,
  }
}
