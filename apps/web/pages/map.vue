<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useProfile } from '~/composables/useProfile'
import { useLevelProgress } from '~/composables/useLevelProgress'
import MapNode from '~/components/map/MapNode.vue'
import MapPath from '~/components/map/MapPath.vue'
import MapAvatar from '~/components/map/MapAvatar.vue'
import MapDecor from '~/components/map/MapDecor.vue'
import levelsData from '~/content/levels.classic.v1.json'
import {
  generateWaypoints,
  computeMapHeight,
  MAP_VIEW_WIDTH,
} from '~/utils/mapWaypoints'
import { nextTick, onMounted, ref } from 'vue'

definePageMeta({ layout: 'bare' })

const router = useRouter()
const { t } = useI18n()
const profile = useProfile()
const { currentLevel, isUnlocked, starsFor, levelProgress } = useLevelProgress(profile)

const mapScrollRef = ref<HTMLElement | null>(null)
const currentNodeRef = ref<HTMLElement | null>(null)

const totalLevels = levelsData.length
const waypoints = generateWaypoints(totalLevels)

const totalStars = computed(() => {
  const progress = levelProgress.value
  return Object.values(progress).reduce((sum, entry) => sum + (entry?.stars ?? 0), 0)
})
const maxStars = computed(() => totalLevels * 3)

function playCurrentLevel() {
  router.push({ path: '/play', query: { level: String(currentLevel.value) } })
}

function nodeStyle(index: number) {
  const { x, y } = waypoints[index]
  const leftPct = (x / MAP_VIEW_WIDTH) * 100
  return {
    position: 'absolute' as const,
    left: `${leftPct}%`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)',
  }
}

/** Avatar is 96px; position above current node (node top ~y-38, avatar bottom at y-40) */
const MAP_AVATAR_OFFSET = 136

function avatarStyle(index: number) {
  const { x, y } = waypoints[index]
  const leftPct = (x / MAP_VIEW_WIDTH) * 100
  return {
    position: 'absolute' as const,
    left: `${leftPct}%`,
    top: `${y - MAP_AVATAR_OFFSET}px`,
    transform: 'translate(-50%, 0)',
  }
}

function selectLevel(level: number) {
  router.push({ path: '/play', query: { level: String(level) } })
}

const mapHeight = computed(() => computeMapHeight(waypoints))

function setCurrentNodeRef(el: unknown, level: number) {
  if (level === currentLevel.value) {
    currentNodeRef.value = el instanceof HTMLElement ? el : null
  }
}

function scrollToCurrentNode() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  currentNodeRef.value?.scrollIntoView({
    block: 'center',
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  nextTick(() => scrollToCurrentNode())
})
</script>

<template>
  <div class="map-page">
    <div class="map-header">
      <h1 class="map-title">{{ t('map.title') }}!</h1>
      <span class="map-progress" role="status" :aria-label="t('map.overallProgress')">
        ⭐ {{ totalStars }} / {{ maxStars }}
      </span>
    </div>
    <button
      type="button"
      class="play-current-cta"
      :aria-label="t('map.playCurrentLevel')"
      @click="playCurrentLevel"
    >
      {{ t('map.playLevel', { n: currentLevel }) }}
    </button>
    <div ref="mapScrollRef" class="map-scroll" role="list" :aria-label="t('map.levelMap')">
      <div class="map-inner" :style="{ height: `${mapHeight}px` }">
        <div class="map-decor-layer">
          <MapDecor :waypoints="waypoints" :map-height="mapHeight" />
        </div>
        <div class="map-container" :style="{ height: `${mapHeight}px` }">
          <MapPath :node-count="totalLevels" />

        <template v-for="i in totalLevels" :key="i">
          <div
            :ref="(el) => setCurrentNodeRef(el, i)"
            :style="nodeStyle(i - 1)"
            role="listitem"
          >
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
              :name="profile.activeProfile.value?.name ?? t('common.player')"
              :maatje-id="profile.activeProfile.value?.maatjeId ?? 'wolkje'"
            />
          </div>
        </template>
        </div>
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
  padding: var(--app-space-sm) var(--app-space-md);
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
}

.map-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: #fff;
  margin: 0;
}

.map-progress {
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-bold);
  color: #fff;
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
  padding: var(--app-space-md) var(--app-space-sm);
  position: relative;
}

.map-scroll::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 120px at 15% 8%, rgba(77, 208, 225, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 50% 160px at 80% 25%, rgba(0, 188, 212, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 70% 100px at 30% 50%, rgba(178, 223, 219, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 55% 140px at 75% 70%, rgba(77, 208, 225, 0.07) 0%, transparent 70%),
    radial-gradient(ellipse 45% 110px at 20% 88%, rgba(0, 188, 212, 0.09) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.map-inner {
  position: relative;
  width: 100%;
}

.map-decor-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.map-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  z-index: 1;
}
</style>
