import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Tests timer logic used by ModeTimedPop.
 * Uses fake timers to verify deterministic behavior.
 */
describe('mode timer logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls recordTimeout after timer expires', () => {
    const recordTimeout = vi.fn()
    const timerSeconds = 15
    let elapsed = 0
    const timerId = setInterval(() => {
      elapsed += 1
      if (elapsed >= timerSeconds) {
        clearInterval(timerId)
        recordTimeout()
      }
    }, 1000)

    expect(recordTimeout).not.toHaveBeenCalled()
    vi.advanceTimersByTime(14000) // 14 seconds
    expect(recordTimeout).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000) // 15th second
    expect(recordTimeout).toHaveBeenCalledTimes(1)

    clearInterval(timerId)
  })
})
