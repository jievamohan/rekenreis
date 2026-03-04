import { fetchHealth, postSessionStats } from '~/utils/api'
import type { SessionStatsPayload } from '~/utils/api'

export function useApi() {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl as string

  return {
    fetchHealth: () => fetchHealth(apiUrl),
    postSessionStats: (payload: SessionStatsPayload) =>
      postSessionStats(apiUrl, payload),
  }
}
