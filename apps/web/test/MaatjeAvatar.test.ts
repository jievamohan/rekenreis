import { describe, it, expect } from 'vitest'
import MaatjeAvatar from '../components/characters/MaatjeAvatar.vue'

describe('MaatjeAvatar', () => {
  it('is a valid Vue component', () => {
    expect(MaatjeAvatar).toBeDefined()
    expect(typeof MaatjeAvatar).toBe('object')
  })
})
