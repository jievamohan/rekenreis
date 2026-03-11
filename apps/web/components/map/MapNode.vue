<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
defineProps<{
  level: number
  stars: number
  unlocked: boolean
  current: boolean
}>()

defineEmits<{ select: [level: number] }>()

/** Arc positions: 3 stars above and around the circle. Arc radius 48, 35px stars. index 1,2,3 → -50°, 0°, 50°. */
function starArcStyle(index: number): Record<string, string> {
  const angleDeg = -50 + (index - 1) * 50
  const r = 48
  const cx = 28
  const cy = 28
  const rad = (angleDeg * Math.PI) / 180
  const x = cx + r * Math.sin(rad)
  const y = cy - r * Math.cos(rad)
  return {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
  }
}
</script>

<template>
  <div class="map-node-wrapper">
    <button
      type="button"
      class="map-node"
      :class="{
        locked: !unlocked,
        current,
        completed: stars > 0,
      }"
      :aria-label="t('map.levelLabel', { level }) + (stars > 0 ? (stars > 1 ? t('map.levelStarsPlural', { stars }) : t('map.levelStars', { stars })) : '') + (!unlocked ? t('map.levelLocked') : '')"
      :aria-disabled="!unlocked"
      :tabindex="unlocked ? 0 : -1"
      @click="unlocked && $emit('select', level)"
      @keydown.enter="unlocked && $emit('select', level)"
      @keydown.space.prevent="unlocked && $emit('select', level)"
    >
      <!-- Stars on top arc of circle -->
      <svg
        v-for="i in 3"
        :key="i"
        class="star-slot"
        :class="{ filled: i <= stars }"
        :style="starArcStyle(i)"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
      <span class="node-number">{{ level }}</span>
      <span v-if="!unlocked" class="node-icon lock" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="11" width="14" height="11" rx="2"/>
          <path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<style scoped>
.map-node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  overflow: visible;
}

.star-slot {
  position: absolute;
  width: 35px;
  height: 35px;
  fill: none;
  stroke: rgba(255, 193, 7, 0.4);
  stroke-width: 1.5;
  pointer-events: none;
}

.star-slot.filled {
  fill: #ffc107;
  stroke: none;
}

.map-node {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: visible;
  border: 3px solid var(--app-map-path-edge);
  background: var(--app-node-unlocked);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  box-shadow: var(--app-shadow-md);
  transition: transform var(--app-transition), box-shadow var(--app-transition);
  position: relative;
}

.map-node:hover:not(.locked) {
  transform: scale(1.08);
  box-shadow: var(--app-shadow-lg);
}

.map-node:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 3px;
}

.map-node.locked {
  background: var(--app-node-locked);
  cursor: default;
  opacity: 0.7;
  border-color: rgba(128, 203, 196, 0.4);
}

.map-node.current {
  border-color: var(--app-primary);
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.3), var(--app-shadow-md);
}

@media (prefers-reduced-motion: no-preference) {
  .map-node.current {
    animation: node-pulse 1.5s ease-in-out infinite;
  }
}

@keyframes node-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.map-node.completed {
  background: var(--app-correct);
  border-color: #4caf50;
}

.node-number {
  font-size: clamp(0.75rem, 4vw, var(--app-font-size-lg));
}

.node-icon.lock {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-node-locked);
  border-radius: 50%;
  border: 1px solid rgba(128, 203, 196, 0.5);
}

.node-icon.lock svg {
  width: 12px;
  height: 12px;
  color: var(--app-text-muted-on-surface);
}
</style>
