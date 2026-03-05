import { defineAsyncComponent, type Component } from 'vue'
import type { MinigameId, MinigameDefinition, MinigameMap, MinigameMapEntry } from '~/types/minigame'
import { MINIGAME_IDS } from '~/types/minigame'
import minigameMapData from '~/content/minigame-map.v1.json'

const registry = new Map<MinigameId, MinigameDefinition>()

function registerMinigame(def: MinigameDefinition): void {
  registry.set(def.id, def)
}

registerMinigame({
  id: 'bubble-pop',
  component: () => import('~/components/minigames/MinigameBubblePop.vue'),
  difficultyKnobs: {
    bubbleCount: { min: 3, max: 6 },
    floatSpeed: { min: 2, max: 4 },
  },
})

registerMinigame({
  id: 'treasure-dive',
  component: () => import('~/components/minigames/MinigameTreasureDive.vue'),
  difficultyKnobs: {
    gemCount: { min: 3, max: 5 },
  },
})

registerMinigame({
  id: 'fish-feed',
  component: () => import('~/components/minigames/MinigameFishFeed.vue'),
  difficultyKnobs: {
    timerSeconds: { min: 8, max: 20 },
    pelletCount: { min: 3, max: 5 },
  },
})

registerMinigame({
  id: 'coral-builder',
  component: () => import('~/components/minigames/MinigameCoralBuilder.vue'),
  difficultyKnobs: {
    pieceCount: { min: 3, max: 5 },
  },
})

registerMinigame({
  id: 'submarine-sort',
  component: () => import('~/components/minigames/MinigameSubmarineSort.vue'),
  difficultyKnobs: {
    compartmentCount: { min: 2, max: 3 },
    itemCount: { min: 3, max: 5 },
  },
})

registerMinigame({
  id: 'starfish-match',
  component: () => import('~/components/minigames/MinigameStarfishMatch.vue'),
  difficultyKnobs: {
    pairCount: { min: 2, max: 4 },
    timerSeconds: { min: 10, max: 25 },
  },
})

const minigameMap: MinigameMap = minigameMapData as unknown as MinigameMap

function resolveMapEntry(levelId: number): MinigameMapEntry {
  for (const rule of minigameMap.rules) {
    if (levelId >= rule.levelMin && levelId <= rule.levelMax) {
      return rule.entry
    }
  }
  return minigameMap.defaultEntry
}

export function useMinigame() {
  function getDefinition(id: MinigameId): MinigameDefinition | undefined {
    return registry.get(id)
  }

  function getAsyncComponent(id: MinigameId): Component | undefined {
    const def = registry.get(id)
    if (!def) return undefined
    return defineAsyncComponent(def.component)
  }

  function getMapEntry(levelId: number): MinigameMapEntry {
    return resolveMapEntry(levelId)
  }

  function getAllIds(): readonly MinigameId[] {
    return MINIGAME_IDS
  }

  return { getDefinition, getAsyncComponent, getMapEntry, getAllIds }
}
