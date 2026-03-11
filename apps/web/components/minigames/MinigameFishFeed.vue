<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { AdditionQuestion } from '~/types/game'
import { useI18n } from '~/composables/useI18n'
import { createSeededRng } from '~/utils/seedableRng'

const props = defineProps<{
  question: AdditionQuestion
  difficultyParams?: Record<string, number>
  timersDisabled?: boolean
}>()

const emit = defineEmits<{
  answer: [choice: number]
}>()

const { t } = useI18n()
const timerSeconds = computed(() => props.difficultyParams?.timerSeconds ?? 15)
const timeLeft = ref(timerSeconds.value)
let timerHandle: ReturnType<typeof setInterval> | null = null
const answered = ref(false)
const prefersReducedMotion = ref(false)
const aquariumRef = ref<HTMLElement | null>(null)
const COUNT_MIN = 4
const COUNT_MAX = 8

/** Seeded positions for pellets scattered in aquarium (deterministic per question) */
function getPelletPositions(q: AdditionQuestion) {
  const rng = createSeededRng(q.a + q.b * 100 + q.correctAnswer * 10000)
  return q.choices.map((value, i) => {
    const angle = (i / Math.max(q.choices.length, 1)) * 2 * Math.PI + rng() * 0.5
    const radius = 28 + rng() * 12
    const left = 50 + Math.cos(angle) * radius
    const top = 50 + Math.sin(angle) * radius
    return {
      value,
      delay: i * 0.2,
      left: `${left}%`,
      top: `${top}%`,
    }
  })
}

const pellets = computed(() => getPelletPositions(props.question))

interface AmbientFish {
  id: string
  y: number
  duration: number
  rightToLeft: boolean
  depth: number // 0=foreground (large), 1=background (small+blur)
}

/** Ambient fish: reactive array, viewport exit removal, respawn when count < COUNT_MIN */
const ambientFish = ref<AmbientFish[]>([])
const fishObservers = new Map<string, IntersectionObserver>()
let fishCheckInterval: ReturnType<typeof setInterval> | null = null

function createFish(rng: () => number): AmbientFish {
  return {
    id: `fish-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    y: 15 + rng() * 70,
    duration: 8 + rng() * 12,
    rightToLeft: rng() > 0.5,
    depth: rng(),
  }
}

function removeFishById(id: string) {
  fishObservers.get(id)?.disconnect()
  fishObservers.delete(id)
  ambientFish.value = ambientFish.value.filter((f) => f.id !== id)
}

function ensureBothDirections(fish: AmbientFish[]) {
  if (fish.length < 2) return
  const hasLtr = fish.some((f) => !f.rightToLeft)
  const hasRtl = fish.some((f) => f.rightToLeft)
  if (!hasLtr) fish[0].rightToLeft = false
  else if (!hasRtl) fish[0].rightToLeft = true
}

function ensureFishCount(rng: () => number) {
  if (ambientFish.value.length < COUNT_MIN) {
    let hasLtr = ambientFish.value.some((f) => !f.rightToLeft)
    let hasRtl = ambientFish.value.some((f) => f.rightToLeft)
    const toAdd = COUNT_MIN - ambientFish.value.length
    for (let i = 0; i < toAdd; i++) {
      const fish = createFish(rng)
      if (!hasRtl) {
        fish.rightToLeft = true
        hasRtl = true
      } else if (!hasLtr) {
        fish.rightToLeft = false
        hasLtr = true
      }
      ambientFish.value = [...ambientFish.value, fish]
    }
    nextTick(() => setupFishObservers(rng))
  }
}

function setupFishObservers(rng: () => number) {
  if (!aquariumRef.value) return
  ambientFish.value.forEach((f) => {
    if (fishObservers.has(f.id)) return
    const el = aquariumRef.value?.querySelector(`[data-fish-id="${f.id}"]`)
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.fishId
            if (id) {
              removeFishById(id)
              ensureFishCount(rng)
            }
          }
        }
      },
      { root: aquariumRef.value, rootMargin: '20px', threshold: 0 }
    )
    obs.observe(el)
    fishObservers.set(f.id, obs)
  })
}

function selectPellet(choice: number) {
  if (answered.value) return
  answered.value = true
  stopTimer()
  emit('answer', choice)
}

function startTimer() {
  timeLeft.value = timerSeconds.value
  timerHandle = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      stopTimer()
      if (!answered.value) {
        onTimeout()
      }
    }
  }, 1000)
}

function onTimeout() {
  if (!answered.value) {
    answered.value = true
    emit('answer', props.question.correctAnswer)
  }
}

function stopTimer() {
  if (timerHandle) {
    clearInterval(timerHandle)
    timerHandle = null
  }
}

/** Water level reaches bottom when timer shows 1s (sync with countdown) */
const timerFraction = computed(() => {
  const left = timeLeft.value
  const total = timerSeconds.value
  if (total <= 1) return left <= 0 ? 0 : 1
  if (left <= 1) return 0
  return (left - 1) / (total - 1)
})

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!props.timersDisabled) {
    startTimer()
  }
  if (!prefersReducedMotion.value) {
    const rng = createSeededRng(props.question.a + props.question.b * 37 + 3700)
    const count = COUNT_MIN + Math.floor(rng() * (COUNT_MAX - COUNT_MIN + 1))
    ambientFish.value = Array.from({ length: count }, () => createFish(rng))
    ensureBothDirections(ambientFish.value)
    nextTick(() => setupFishObservers(rng))
    fishCheckInterval = setInterval(() => ensureFishCount(rng), 2000)
  }
})

onUnmounted(() => {
  stopTimer()
  fishObservers.forEach((obs) => obs.disconnect())
  fishObservers.clear()
  if (fishCheckInterval) {
    clearInterval(fishCheckInterval)
    fishCheckInterval = null
  }
})
</script>

<template>
  <div
    class="fish-feed-scene"
    data-testid="minigame-fish-feed"
    role="group"
    :aria-label="t('minigameFishFeed.ariaLabel')"
  >
    <div ref="aquariumRef" class="aquarium" aria-hidden="true">
      <!-- Ambient swimming fish (decorative, pointer-events: none) -->
      <div
        v-if="!prefersReducedMotion"
        class="fish-ambient-layer"
        aria-hidden="true"
      >
        <span
          v-for="f in ambientFish"
          :key="f.id"
          :data-fish-id="f.id"
          class="ambient-fish"
          :class="{ 'fish-rtl': f.rightToLeft }"
          :style="{
            '--fish-y': `${f.y}%`,
            '--fish-duration': `${f.duration}s`,
            '--fish-scale': 1.2 - 0.6 * f.depth,
            '--fish-blur': `${f.depth * 4}px`,
            '--fish-opacity': 1 - 0.4 * f.depth,
          }"
        >🐟</span>
      </div>
      <!-- Timer as water level: fills from bottom, drops as time runs out -->
      <div
        v-if="!timersDisabled"
        class="water-level"
        :style="{ height: `${timerFraction * 100}%` }"
        role="timer"
        :aria-label="t('minigameFishFeed.timerLabel', { seconds: timeLeft })"
      >
        <span class="timer-badge">{{ timeLeft }}s</span>
      </div>

      <div
        v-if="!answered"
        class="pellets-zone"
        role="group"
        :aria-label="t('minigameFishFeed.pelletLabel', { value: '' })"
      >
        <button
          v-for="pellet in pellets"
          :key="pellet.value"
          class="pellet"
          :class="{ 'pellet-animate': !prefersReducedMotion }"
          :style="{
            '--delay': `${pellet.delay}s`,
            left: pellet.left,
            top: pellet.top,
          }"
          :disabled="answered"
          :aria-label="t('minigameFishFeed.pelletLabel', { value: pellet.value })"
          @click="selectPellet(pellet.value)"
        >
          <span class="pellet-number">{{ pellet.value }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fish-feed-scene {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-height: 320px;
  position: relative;
}

.aquarium {
  width: 100%;
  max-width: 340px;
  aspect-ratio: 1;
  border-radius: 24px;
  border: 4px solid var(--app-primary, #4fc3f7);
  background: linear-gradient(180deg, rgba(3, 169, 244, 0.15) 0%, rgba(0, 150, 136, 0.25) 100%);
  box-shadow:
    inset 0 0 40px rgba(0, 150, 136, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.water-level {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0; /* behind fish so ambient fish are visible */
  background: linear-gradient(180deg, rgba(3, 169, 244, 0.4), rgba(0, 150, 136, 0.5));
  transition: height 1s linear;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.timer-badge {
  font-family: var(--app-font, sans-serif);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #004d40);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

/* Ambient decorative fish: swim horizontally, above water-level */
.fish-ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.ambient-fish {
  position: absolute;
  top: var(--fish-y, 50%);
  left: -10%;
  font-size: 2em;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2)) blur(var(--fish-blur, 0));
  opacity: var(--fish-opacity, 1);
  animation: swim-horizontal var(--fish-duration, 12s) linear infinite;
}

.ambient-fish.fish-rtl {
  left: auto;
  right: -10%;
  animation: swim-horizontal-rtl var(--fish-duration, 12s) linear infinite;
}

/* traverse full aquarium; scale from --fish-scale for depth */
/* 🐟 faces left; L→R needs scaleX(-1) to face right, R→L needs no flip to face left */
@keyframes swim-horizontal {
  from { transform: scaleX(-1) scale(var(--fish-scale, 1)) translateX(0); }
  to { transform: scaleX(-1) scale(var(--fish-scale, 1)) translateX(min(400px, 120vw)); }
}

@keyframes swim-horizontal-rtl {
  from { transform: scale(var(--fish-scale, 1)) translateX(0); }
  to { transform: scale(var(--fish-scale, 1)) translateX(min(-400px, -120vw)); }
}

.pellets-zone {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.pellets-zone .pellet {
  pointer-events: auto;
  position: absolute;
  transform: translate(-50%, -50%);
  margin-left: 0;
  margin-top: 0;
}

.pellet {
  width: 56px;
  height: 56px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  border: 2px solid var(--app-correct, #66bb6a);
  background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pellet:hover:not(:disabled),
.pellet:focus-visible {
  transform: translate(-50%, -50%) scale(1.12);
}

.pellet:focus-visible {
  outline: 3px solid var(--app-primary, #4fc3f7);
  outline-offset: 3px;
}

.pellet:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pellet-animate {
  animation: pellet-float-in 0.5s ease-out;
  animation-delay: var(--delay, 0s);
  animation-fill-mode: backwards;
}

.pellet-number {
  font-family: var(--app-font, sans-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--app-text-on-surface, #1b5e20);
  pointer-events: none;
}

@keyframes pellet-float-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pellet-animate {
    animation: none;
  }
  .water-level {
    transition: none;
  }
  /* Epic 37: ambient fish hidden via v-if; disable animations as fallback */
  .ambient-fish {
    animation: none;
  }
}
</style>
