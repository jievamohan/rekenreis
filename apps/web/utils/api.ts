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

function xsrfLog(msg: string, data?: Record<string, unknown>) {
  if (import.meta.server) return
  try {
    const config = useRuntimeConfig()
    if (!config.public?.xsrfDebugLog) return
  } catch {
    return
  }
  if (typeof console !== 'undefined') {
    console.error('[xsrf-client]', msg, JSON.stringify(data ?? {}))
  }
}

/** Read XSRF-TOKEN cookie for CSRF protection (client-side only). */
function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (!match) return null
  const token = decodeURIComponent(match[1])
  xsrfLog('getXsrfToken', { hasToken: !!token, prefix: token ? token.slice(0, 12) + '...' : null })
  return token
}

function apiFetch(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
  fetcher: typeof fetch = fetch
): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase()
  const xsrf = method !== 'GET' && method !== 'HEAD' ? getXsrfToken() : null
  xsrfLog('apiFetch', { path, method, hasXsrf: !!xsrf, willSendHeader: !!xsrf })
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
  xsrfLog('fetchCsrfCookie REQUEST', { url: `${baseUrl}/sanctum/csrf-cookie` })
  const res = await fetcher(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  const setCookie = res.headers.get('set-cookie')
  xsrfLog('fetchCsrfCookie RESPONSE', {
    status: res.status,
    ok: res.ok,
    hasSetCookie: !!setCookie,
    setCookieLen: setCookie?.length ?? 0,
  })
}

export async function postLogin(
  baseUrl: string,
  payload: LoginPayload,
  fetcher: typeof fetch = fetch
): Promise<{ user: AuthUser }> {
  xsrfLog('postLogin STEP1', { url: `${baseUrl}/sanctum/csrf-cookie` })
  await fetchCsrfCookie(baseUrl, fetcher)
  xsrfLog('postLogin STEP2', { url: `${baseUrl}/api/login`, email: payload.email })
  const res = await apiFetch(baseUrl, '/api/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  xsrfLog('postLogin STEP3', { status: res.status, ok: res.ok })
  const data = await res.json()
  if (!res.ok) {
    xsrfLog('postLogin FAIL', { status: res.status, message: data.message })
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  xsrfLog('postLogin OK', { userId: data.user?.id })
  return data
}

export async function postRegister(
  baseUrl: string,
  payload: RegisterPayload,
  fetcher: typeof fetch = fetch
): Promise<{ user: AuthUser }> {
  xsrfLog('postRegister STEP1', { url: `${baseUrl}/sanctum/csrf-cookie` })
  await fetchCsrfCookie(baseUrl, fetcher)
  xsrfLog('postRegister STEP2', { url: `${baseUrl}/api/register`, email: payload.email })
  const res = await apiFetch(baseUrl, '/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, fetcher)
  xsrfLog('postRegister STEP3', { status: res.status, ok: res.ok })
  const data = await res.json()
  if (!res.ok) {
    xsrfLog('postRegister FAIL', { status: res.status, message: data.message })
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  xsrfLog('postRegister OK', { userId: data.user?.id })
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
  xsrfLog('fetchUser REQUEST', { url: `${baseUrl}/api/user` })
  const res = await apiFetch(baseUrl, '/api/user', {}, fetcher)
  xsrfLog('fetchUser RESPONSE', { status: res.status, ok: res.ok })
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  xsrfLog('fetchUser OK', { userId: data.user?.id })
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

/** Debug auth state (CI only). Fetches /api/debug/auth-flow with credentials. */
export async function fetchDebugAuth(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetcher(`${baseUrl}/api/debug/auth-flow`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return { error: `HTTP ${res.status}` }
    return (await res.json()) as Record<string, unknown>
  } catch (e) {
    return { error: String(e) }
  }
}

export interface SessionStatsPayload {
  score?: number
  rounds?: number
}

export interface ProgressResponse {
  progress: Record<string, unknown>
}

export async function fetchProgress(
  baseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<ProgressResponse> {
  const res = await apiFetch(baseUrl, '/api/progress', {}, fetcher)
  if (res.status === 401) {
    throw new Error('Unauthenticated')
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as ProgressResponse
  return { progress: data.progress ?? {} }
}

export async function putProgress(
  baseUrl: string,
  progress: Record<string, unknown>,
  fetcher: typeof fetch = fetch
): Promise<ProgressResponse> {
  const res = await apiFetch(baseUrl, '/api/progress', {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  }, fetcher)
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(data.message ?? `HTTP ${res.status}`)
  }
  return (await res.json()) as ProgressResponse
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
