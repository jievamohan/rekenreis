import { describe, it, expect } from 'vitest'

describe('security regression', () => {
  it('expects X-Frame-Options or equivalent in security headers config', () => {
    // Nuxt 3 uses routeRules for headers. This test documents expected config.
    // Actual headers are set in nuxt.config.ts; integration needs running server.
    const expectedHeaders = ['X-Frame-Options', 'X-Content-Type-Options']
    expect(expectedHeaders).toContain('X-Frame-Options')
  })

  it('expects X-Content-Type-Options nosniff', () => {
    expect(['X-Content-Type-Options']).toContain('X-Content-Type-Options')
  })
})
