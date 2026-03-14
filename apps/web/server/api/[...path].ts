import { joinURL } from 'ufo'

const XSRF_DEBUG = !!process.env.XSRF_DEBUG_LOG

function xsrfLog(msg: string, data?: Record<string, unknown>) {
  if (XSRF_DEBUG) console.error('[xsrf-api-proxy]', msg, data ?? '')
}

function forwardSetCookies(
  event: import('h3').H3Event,
  res: { headers: Headers },
  requestHost: string
) {
  const setCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : []
  for (const cookie of setCookies) {
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
}

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  const base = useRuntimeConfig().apiProxyTarget || 'http://api:8000'
  const target = joinURL(base, 'api', Array.isArray(path) ? path.join('/') : path || '')
  const method = getMethod(event)
  const body = method !== 'GET' && method !== 'HEAD' ? await readRawBody(event) : undefined
  const headers = getHeaders(event)
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
  const apiPath = Array.isArray(path) ? path.join('/') : path || ''
  const cookie = headers['cookie'] || headers['Cookie']
  const xsrfHeader = headers['x-xsrf-token'] || headers['X-XSRF-TOKEN']
  const cookieNames = cookie
    ? String(cookie)
        .split(';')
        .map((p) => (p.trim().split('=')[0] || '').trim())
        .filter(Boolean)
    : []
  xsrfLog('REQUEST', {
    path: apiPath,
    method,
    hasXsrfHeader: !!xsrfHeader,
    xsrfPrefix: xsrfHeader ? String(xsrfHeader).slice(0, 12) + '...' : null,
    cookieNames,
    hasXsrfCookie: cookieNames.some((n) => n.includes('XSRF')),
    hasLaravelSession: cookieNames.some((n) => n.includes('laravel') || n.includes('session')),
  })
  const res = await $fetch.raw(target, {
    method,
    body,
    headers: Object.fromEntries(forwarded),
  })
  const resHeaders: Record<string, string> = {}
  for (const [k, v] of res.headers.entries()) {
    if (k.toLowerCase() !== 'set-cookie') {
      resHeaders[k] = v
    }
  }
  setResponseHeaders(event, resHeaders)
  setResponseStatus(event, res.status)
  const requestHost = hostStr ? hostStr.split(':')[0] : ''
  forwardSetCookies(event, res, requestHost)
  return res._data
})
