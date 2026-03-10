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
  contractV2: {
    interactionType: 'tap-choice',
    requiredInputs: ['pointer', 'keyboard'],
    timerPolicy: null,
    uniqueDifficultyKnobs: [
      { key: 'bubbleCount', min: 3, max: 6, description: 'Number of floating bubbles' },
      { key: 'floatSpeed', min: 2, max: 4, description: 'Vertical float speed (px/frame)' },
    ],
    layoutClass: 'layout-float-field',
    isNew: false,
  },
})

registerMinigame({
  id: 'treasure-dive',
  component: () => import('~/components/minigames/MinigameTreasureDive.vue'),
  difficultyKnobs: {
    gemCount: { min: 3, max: 5 },
  },
  contractV2: {
    interactionType: 'drag-drop',
    requiredInputs: ['pointer', 'drag', 'keyboard'],
    timerPolicy: null,
    uniqueDifficultyKnobs: [
      { key: 'gemCount', min: 3, max: 5, description: 'Number of draggable gems' },
    ],
    layoutClass: 'layout-dnd-dualzone',
    isNew: false,
  },
})

registerMinigame({
  id: 'fish-feed',
  component: () => import('~/components/minigames/MinigameFishFeed.vue'),
  difficultyKnobs: {
    timerSeconds: { min: 8, max: 20 },
    pelletCount: { min: 3, max: 5 },
  },
  contractV2: {
    interactionType: 'timed-pop',
    requiredInputs: ['pointer', 'keyboard', 'timed-response'],
    timerPolicy: {
      enabledByDefault: true,
      allowDisableInSettings: true,
      timeoutBehavior: 'hint-continue',
      reducedMotionBehavior: 'degrade',
    },
    uniqueDifficultyKnobs: [
      { key: 'timerSeconds', min: 8, max: 20, description: 'Countdown duration in seconds' },
      { key: 'pelletCount', min: 3, max: 5, description: 'Number of pellet choices' },
    ],
    layoutClass: 'layout-pop-field',
    isNew: false,
  },
})

registerMinigame({
  id: 'memory-match',
  component: () => import('~/components/minigames/MinigameMemoryMatch.vue'),
  difficultyKnobs: {
    pairCount: { min: 2, max: 6 },
    timerSeconds: { min: 25, max: 60 },
  },
  contractV2: {
    interactionType: 'memory-flip',
    requiredInputs: ['pointer', 'keyboard'],
    timerPolicy: {
      enabledByDefault: true,
      allowDisableInSettings: true,
      timeoutBehavior: 'hint-continue',
      reducedMotionBehavior: 'degrade',
    },
    uniqueDifficultyKnobs: [
      { key: 'pairCount', min: 3, max: 6, description: 'Number of sum/answer pairs' },
      { key: 'timerSeconds', min: 25, max: 60, description: 'Time limit for the whole game' },
    ],
    layoutClass: 'layout-match-grid',
    isNew: false,
  },
})

registerMinigame({
  id: 'shell-collector',
  component: () => import('~/components/minigames/MinigameShellCollector.vue'),
  difficultyKnobs: {
    shellTargetBonus: { min: 0, max: 2 },
  },
  contractV2: {
    interactionType: 'tap-to-increment',
    requiredInputs: ['pointer', 'keyboard'],
    timerPolicy: null,
    uniqueDifficultyKnobs: [
      { key: 'shellTargetBonus', min: 0, max: 2, description: 'Extra shells to add for harder levels' },
    ],
    layoutClass: 'layout-embedded-math',
    isNew: false,
  },
})

registerMinigame({
  id: 'starfish-match',
  component: () => import('~/components/minigames/MinigameStarfishMatch.vue'),
  difficultyKnobs: {
    pairCount: { min: 2, max: 4 },
    timerSeconds: { min: 10, max: 25 },
  },
  contractV2: {
    interactionType: 'timed-pop',
    requiredInputs: ['pointer', 'keyboard', 'timed-response'],
    timerPolicy: {
      enabledByDefault: true,
      allowDisableInSettings: true,
      timeoutBehavior: 'hint-continue',
      reducedMotionBehavior: 'degrade',
    },
    uniqueDifficultyKnobs: [
      { key: 'pairCount', min: 2, max: 4, description: 'Number of starfish pairs' },
      { key: 'timerSeconds', min: 10, max: 25, description: 'Match timer duration in seconds' },
    ],
    layoutClass: 'layout-match-grid',
    isNew: false,
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

  function getAllDefinitions(): MinigameDefinition[] {
    return Array.from(registry.values())
  }

  return { getDefinition, getAsyncComponent, getMapEntry, getAllIds, getAllDefinitions }
}
