export interface HealthResponse {
  status: string
  version: string
}

export async function fetchHealth(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<HealthResponse> {
  const res = await fetcher(`${baseUrl}/api/health`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json() as Promise<HealthResponse>
}
