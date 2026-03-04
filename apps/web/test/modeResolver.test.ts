import { describe, it, expect } from 'vitest'
import { resolveInteractionMode } from '../utils/modeResolver'

describe('resolveInteractionMode', () => {
  it('returns classic for undefined', () => {
    expect(resolveInteractionMode(undefined)).toBe('classic')
  })

  it('returns classic for empty string', () => {
    expect(resolveInteractionMode('')).toBe('classic')
  })

  it('returns classic for mode=classic', () => {
    expect(resolveInteractionMode('classic')).toBe('classic')
  })

  it('returns timed-pop for mode=timed-pop', () => {
    expect(resolveInteractionMode('timed-pop')).toBe('timed-pop')
  })

  it('returns classic for mode=pack (legacy content param)', () => {
    expect(resolveInteractionMode('pack')).toBe('classic')
  })

  it('returns classic for unknown mode', () => {
    expect(resolveInteractionMode('unknown')).toBe('classic')
  })

  it('normalizes timed_pop to timed-pop', () => {
    expect(resolveInteractionMode('timed_pop')).toBe('timed-pop')
  })

  it('returns build-bridge for mode=build-bridge', () => {
    expect(resolveInteractionMode('build-bridge')).toBe('build-bridge')
  })

  it('normalizes build_bridge to build-bridge', () => {
    expect(resolveInteractionMode('build_bridge')).toBe('build-bridge')
  })
})
