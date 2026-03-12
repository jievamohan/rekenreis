import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  const base = useRuntimeConfig().apiProxyTarget || 'http://api:8000'
  const target = joinURL(base, 'sanctum', Array.isArray(path) ? path.join('/') : path || '')
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
  for (const cookie of setCookies) {
    const fixed = cookie
      .replace(/;\s*Domain=[^;]+/gi, '')
      .replace(/;\s*Secure/gi, '')
    appendResponseHeader(event, 'set-cookie', fixed)
  }
  return res._data
})
