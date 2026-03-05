import nlStrings from '~/content/locales/nl.json'

type NestedMessages = { [key: string]: string | NestedMessages }

const messages = new Map<string, string>()

function flatten(obj: NestedMessages, prefix: string): void {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      messages.set(fullKey, value)
    } else if (value !== null && typeof value === 'object') {
      flatten(value as NestedMessages, fullKey)
    }
  }
}

flatten(nlStrings as unknown as NestedMessages, '')

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return key in params ? String(params[key]) : `{${key}}`
  })
}

export function useI18n() {
  function t(key: string, params?: Record<string, string | number>): string {
    const value = messages.get(key)
    if (value === undefined) return key
    return params ? interpolate(value, params) : value
  }

  return { t }
}
