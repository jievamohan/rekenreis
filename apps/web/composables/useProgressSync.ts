import type { Ref } from 'vue'
import { fetchProgress, putProgress } from '~/utils/api'
import { createSchemaForUser, type ProfileSchemaV1 } from '~/utils/profileSchema'

const DEBOUNCE_MS = 500

export function useProgressSync(
  schemaRef: Ref<ProfileSchemaV1 | undefined>,
  apiUrl: string,
  isAuthenticated: () => boolean,
  user: () => { name: string } | null
) {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function fetchAndHydrate() {
    const u = user()
    if (!u) return
    try {
      const { progress } = await fetchProgress(apiUrl)
      const schema = createSchemaForUser(u.name, progress)
      schemaRef.value = schema
    } catch {
      schemaRef.value = createSchemaForUser(u.name)
    }
  }

  function saveToApi(data: ProfileSchemaV1 | undefined) {
    if (!isAuthenticated() || !data) return
    clearTimeout(debounceTimer!)
    debounceTimer = setTimeout(async () => {
      try {
        await putProgress(apiUrl, data as unknown as Record<string, unknown>)
      } catch {
        // ignore; will retry on next change
      } finally {
        debounceTimer = null
      }
    }, DEBOUNCE_MS)
  }

  return {
    fetchAndHydrate,
    saveToApi,
  }
}
