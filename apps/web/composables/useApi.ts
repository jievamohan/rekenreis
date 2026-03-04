import { fetchHealth } from '~/utils/api'

export function useApi() {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl as string

  return {
    fetchHealth: () => fetchHealth(apiUrl),
  }
}
