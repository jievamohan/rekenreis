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

export interface SessionStatsPayload {
  score?: number
  rounds?: number
}

export async function postSessionStats(
  baseUrl: string,
  payload: SessionStatsPayload,
  fetcher: typeof fetch = fetch
): Promise<void> {
  const res = await fetcher(`${baseUrl}/api/session-stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
}
