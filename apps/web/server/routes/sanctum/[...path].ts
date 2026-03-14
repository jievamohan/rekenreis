import { joinURL } from 'ufo'

const XSRF_DEBUG = !!process.env.XSRF_DEBUG_LOG

function xsrfLog(msg: string, data?: Record<string, unknown>) {
  if (XSRF_DEBUG) console.error('[xsrf-sanctum-proxy]', msg, data ?? '')
}

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  const base = useRuntimeConfig().apiProxyTarget || 'http://api:8000'
  const target = joinURL(base, 'sanctum', Array.isArray(path) ? path.join('/') : path || '')
  const method = getMethod(event)
  const body = method !== 'GET' && method !== 'HEAD' ? await readRawBody(event) : undefined
  const headers = getHeaders(event)
  const cookie = headers['cookie'] || headers['Cookie']
  const cookieNames = cookie
    ? String(cookie)
        .split(';')
        .map((p) => (p.trim().split('=')[0] || '').trim())
        .filter(Boolean)
    : []
  xsrfLog('REQUEST', {
    path: path ? (Array.isArray(path) ? path.join('/') : path) : 'csrf-cookie',
    method,
    host: headers['host'] || headers['Host'],
    hasCookie: !!cookie,
    cookieNames,
  })
  const forwarded = new Headers()
  const host = headers['host'] || headers['Host']
  const hostStr = host ? (Array.isArray(host) ? host[0] : String(host)) : ''
  if (hostStr) {
    forwarded.set('Host', hostStr)
    forwarded.set('X-Forwarded-Host', hostStr)
  }
  const proto = headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || 'http'
  forwarded.set('X-Forwarded-Proto', Array.isArray(proto) ? proto[0] : String(proto))
  for (const [k, v] of Object.entries(headers)) {
    const lower = k.toLowerCase()
    if (!['connection', 'content-length'].includes(lower) && v) {
      forwarded.set(k, Array.isArray(v) ? v.join(', ') : String(v))
    }
  }
  let res: Awaited<ReturnType<typeof $fetch.raw>>
  try {
    res = await $fetch.raw(target, {
      method,
      body,
      headers: Object.fromEntries(forwarded),
      ignoreResponseError: true, // pass through 5xx so client gets API error body (debug)
    })
  } catch (e) {
    console.error('[sanctum-proxy] upstream error', { target, error: String(e) })
    throw e
  }
  if (res.status >= 500) {
    const errBody = typeof res._data === 'string' ? res._data : JSON.stringify(res._data)
    console.error('[sanctum-proxy] upstream 5xx', { target, status: res.status, body: errBody.slice(0, 500) })
  }
  const resHeaders: Record<string, string> = {}
  for (const [k, v] of res.headers.entries()) {
    if (k.toLowerCase() !== 'set-cookie') {
      resHeaders[k] = v
    }
  }
  setResponseHeaders(event, resHeaders)
  setResponseStatus(event, res.status)
  const setCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : []
  const setCookieNames: string[] = []
  const requestHost = hostStr ? hostStr.split(':')[0] : ''
  for (const cookie of setCookies) {
    const name = cookie.split('=')[0]?.trim() || ''
    if (name) setCookieNames.push(name)
    // Strip Domain only when it would mismatch request host (e.g. API returns Domain=api).
    // Preserve Domain=web for CI (browser at web:3000) so session cookie is sent correctly.
    let fixed = cookie.replace(/;\s*Secure/gi, '')
    const domainMatch = fixed.match(/;\s*Domain=([^;]+)/i)
    if (domainMatch) {
      const apiDomain = domainMatch[1].trim().toLowerCase()
      if (apiDomain !== requestHost.toLowerCase()) {
        fixed = fixed.replace(/;\s*Domain=[^;]+/gi, '')
      }
    }
    appendResponseHeader(event, 'set-cookie', fixed)
  }
  xsrfLog('RESPONSE', {
    status: res.status,
    setCookieNames,
    hasXsrf: setCookieNames.some((n) => n.includes('XSRF')),
  })
  return res._data
})
