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
const { currentLevel, isUnlocked, starsFor } = useLevelProgress(profile)

const totalLevels = levelsData.length

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
    <h1 class="map-title">Level Map</h1>
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

.map-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  text-align: center;
  margin: var(--app-space-sm) 0;
  flex-shrink: 0;
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
