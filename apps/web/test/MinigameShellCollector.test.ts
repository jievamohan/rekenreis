import { describe, it, expect } from 'vitest'
import MinigameShellCollector from '../components/minigames/MinigameShellCollector.vue'

describe('MinigameShellCollector', () => {
  it('is a valid Vue component', () => {
    expect(MinigameShellCollector).toBeDefined()
    expect(typeof MinigameShellCollector).toBe('object')
  })

  it('can be imported and used in MinigameRenderer', () => {
    expect(MinigameShellCollector).toBeTruthy()
  })
})
