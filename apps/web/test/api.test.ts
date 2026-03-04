import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchHealth } from '../utils/api'

describe('fetchHealth', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns health response when API returns ok', async () => {
    const response = { status: 'ok', version: '1.0.0' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(response),
    })

    const result = await fetchHealth('http://localhost:8000', mockFetch)

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/health')
    expect(result).toEqual(response)
  })

  it('throws when API returns non-ok status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(
      fetchHealth('http://localhost:8000', mockFetch)
    ).rejects.toThrow('HTTP 500')
  })
})
