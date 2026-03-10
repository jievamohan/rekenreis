import { describe, it, expect } from 'vitest'
import MinigameBouwDeToren from '~/components/minigames/MinigameBouwDeToren.vue'

describe('MinigameBouwDeToren', () => {
  it('is a valid Vue component', () => {
    expect(MinigameBouwDeToren).toBeDefined()
    expect(typeof MinigameBouwDeToren).toBe('object')
  })
})
