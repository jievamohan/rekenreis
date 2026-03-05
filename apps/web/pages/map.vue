<script setup lang="ts">
import { useProfile } from '~/composables/useProfile'
import { useLevelProgress } from '~/composables/useLevelProgress'
import MapNode from '~/components/map/MapNode.vue'
import MapPath from '~/components/map/MapPath.vue'
import MapAvatar from '~/components/map/MapAvatar.vue'
import levelsData from '~/content/levels.classic.v1.json'

definePageMeta({ layout: 'bare' })

const router = useRouter()
const profile = useProfile()
const { currentLevel, isUnlocked, starsFor, levelProgress } = useLevelProgress(profile)

const totalLevels = levelsData.length

const totalStars = computed(() => {
  const progress = levelProgress.value
  return Object.values(progress).reduce((sum, entry) => sum + (entry?.stars ?? 0), 0)
})
const maxStars = computed(() => totalLevels * 3)

function playCurrentLevel() {
  router.push({ path: '/play', query: { level: String(currentLevel.value) } })
}

const viewWidth = 300
const spacing = 80
const startY = 40

function nodePosition(index: number) {
  const y = startY + index * spacing
  const offsetX = (index % 2 === 0 ? -1 : 1) * 50
  const x = viewWidth / 2 + offsetX
  return { x, y }
}

function nodeStyle(index: number) {
  const { x, y } = nodePosition(index)
  const leftPct = (x / viewWidth) * 100
  const topPx = y
  return {
    position: 'absolute' as const,
    left: `${leftPct}%`,
    top: `${topPx}px`,
    transform: 'translate(-50%, -50%)',
  }
}

function avatarStyle(index: number) {
  const { x, y } = nodePosition(index)
  const leftPct = (x / viewWidth) * 100
  return {
    position: 'absolute' as const,
    left: `${leftPct}%`,
    top: `${y - 44}px`,
    transform: 'translate(-50%, 0)',
  }
}

function selectLevel(level: number) {
  router.push({ path: '/play', query: { level: String(level) } })
}

const mapHeight = computed(() => Math.max(400, totalLevels * spacing + 60))
</script>

<template>
  <div class="map-page">
    <div class="map-header">
      <h1 class="map-title">Choose Level</h1>
      <span class="map-progress" role="status" aria-label="Overall progress">
        ⭐ {{ totalStars }} / {{ maxStars }}
      </span>
    </div>
    <button
      type="button"
      class="play-current-cta"
      aria-label="Play current level"
      @click="playCurrentLevel"
    >
      Play Level {{ currentLevel }}
    </button>
    <div class="map-scroll" role="list" aria-label="Level map">
      <div class="map-container" :style="{ height: `${mapHeight}px` }">
        <MapPath :node-count="totalLevels" />

        <template v-for="i in totalLevels" :key="i">
          <div :style="nodeStyle(i - 1)" role="listitem">
            <MapNode
              :level="i"
              :stars="starsFor(i)"
              :unlocked="isUnlocked(i)"
              :current="i === currentLevel"
              @select="selectLevel"
            />
          </div>
          <div v-if="i === currentLevel" :style="avatarStyle(i - 1)">
            <MapAvatar
              :avatar-id="profile.activeProfile.value?.avatarId ?? 'default'"
              :name="profile.activeProfile.value?.name ?? 'Player'"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--app-space-md);
  flex-shrink: 0;
}

.map-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  margin: var(--app-space-sm) 0;
}

.map-progress {
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
}

.play-current-cta {
  display: block;
  margin: 0 auto var(--app-space-md);
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  background: var(--app-primary);
  border: none;
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.play-current-cta:hover {
  background: var(--app-primary-hover);
}

.play-current-cta:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.map-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: var(--app-space-md);
}

.map-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}
</style>
