export interface HealthResponse {
  status: string
  version: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}

/** Read XSRF-TOKEN cookie for CSRF protection (client-side only). */
function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (!match) return null
  return decodeURIComponent(match[1])
}

function apiFetch(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
  fetcher: typeof fetch = fetch
): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase()
  const xsrf = method !== 'GET' && method !== 'HEAD' ? getXsrfToken() : null
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (xsrf) {
    headers['X-XSRF-TOKEN'] = xsrf
  }
  return fetcher(`${baseUrl}${path}`, {
    ...options,
    body: options.body,
    credentials: 'include',
    headers,
  })
}

export async function fetchCsrfCookie(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<void> {
  await fetcher(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
}

export async function postLogin(
  baseUrl: string,
  payload: LoginPayload,
  fetcher: typeof fetch = fetch
): Promise<{ user: AuthUser }> {
  await fetchCsrfCookie(baseUrl, fetcher)
  const res = await apiFetch(baseUrl, '/api/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  return data
}

export async function postRegister(
  baseUrl: string,
  payload: RegisterPayload,
  fetcher: typeof fetch = fetch
): Promise<{ user: AuthUser }> {
  await fetchCsrfCookie(baseUrl, fetcher)
  const res = await apiFetch(baseUrl, '/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  return data
}

export async function postForgotPassword(
  baseUrl: string,
  payload: ForgotPasswordPayload,
  fetcher: typeof fetch = fetch
): Promise<void> {
  await fetchCsrfCookie(baseUrl, fetcher)
  const res = await apiFetch(baseUrl, '/api/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
}

export async function postResetPassword(
  baseUrl: string,
  payload: ResetPasswordPayload,
  fetcher: typeof fetch = fetch
): Promise<void> {
  await fetchCsrfCookie(baseUrl, fetcher)
  const res = await apiFetch(baseUrl, '/api/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
}

export async function fetchUser(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<AuthUser | null> {
  const res = await apiFetch(baseUrl, '/api/user', {}, fetcher)
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.user ?? null
}

export async function postLogout(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<void> {
  await apiFetch(baseUrl, '/api/logout', { method: 'POST' }, fetcher)
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
