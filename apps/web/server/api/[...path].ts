import { joinURL } from 'ufo'

function forwardSetCookies(event: import('h3').H3Event, res: { headers: Headers }) {
  const setCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : []
  for (const cookie of setCookies) {
    const fixed = cookie
      .replace(/;\s*Domain=[^;]+/gi, '')
      .replace(/;\s*Secure/gi, '')
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
  forwardSetCookies(event, res)
  return res._data
})
