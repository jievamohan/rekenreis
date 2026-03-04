import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useSound } from '../composables/useSound'

const mockPlay = vi.fn().mockResolvedValue(undefined)
const MockAudio = vi.fn().mockImplementation(() =>
  ({ play: mockPlay, currentTime: 0 } as unknown as HTMLAudioElement)
)

describe('useSound', () => {
  beforeEach(() => {
    vi.stubGlobal('Audio', MockAudio)
    mockPlay.mockClear()
    MockAudio.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('plays correct when soundOn is true', () => {
    const profile = { activeProfile: ref({ prefs: { soundOn: true } }) }
    const { playCorrect } = useSound(profile)
    playCorrect()
    expect(mockPlay).toHaveBeenCalledTimes(1)
    expect(MockAudio).toHaveBeenCalledWith('/sfx/correct.wav')
  })

  it('plays wrong when soundOn is true', () => {
    const profile = { activeProfile: ref({ prefs: { soundOn: true } }) }
    const { playWrong } = useSound(profile)
    playWrong()
    expect(mockPlay).toHaveBeenCalledTimes(1)
    expect(MockAudio).toHaveBeenCalledWith('/sfx/wrong.wav')
  })

  it('plays celebrate when soundOn is true', () => {
    const profile = { activeProfile: ref({ prefs: { soundOn: true } }) }
    const { playCelebrate } = useSound(profile)
    playCelebrate()
    expect(mockPlay).toHaveBeenCalledTimes(1)
    expect(MockAudio).toHaveBeenCalledWith('/sfx/celebrate.wav')
  })

  it('does not play when soundOn is false', () => {
    const profile = { activeProfile: ref({ prefs: { soundOn: false } }) }
    const { playCorrect } = useSound(profile)
    playCorrect()
    expect(mockPlay).not.toHaveBeenCalled()
  })

  it('plays when profile is undefined (default soundOn)', () => {
    const { playCorrect } = useSound(undefined)
    playCorrect()
    expect(mockPlay).toHaveBeenCalledTimes(1)
  })

  it('does not throw when Audio fails', () => {
    vi.stubGlobal('Audio', () => {
      throw new Error('Audio not supported')
    })
    const profile = { activeProfile: ref({ prefs: { soundOn: true } }) }
    const { playCorrect } = useSound(profile)
    expect(() => playCorrect()).not.toThrow()
  })
})
