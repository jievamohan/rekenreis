<script setup lang="ts">
defineProps<{
  level: number
  stars: number
  unlocked: boolean
  current: boolean
}>()

defineEmits<{ select: [level: number] }>()
</script>

<template>
  <button
    type="button"
    class="map-node"
    :class="{
      locked: !unlocked,
      current,
      completed: stars > 0,
    }"
    :aria-label="`Level ${level}${stars > 0 ? `, ${stars} star${stars > 1 ? 's' : ''}` : ''}${!unlocked ? ', locked' : ''}`"
    :aria-disabled="!unlocked"
    :tabindex="unlocked ? 0 : -1"
    @click="unlocked && $emit('select', level)"
    @keydown.enter="unlocked && $emit('select', level)"
    @keydown.space.prevent="unlocked && $emit('select', level)"
  >
    <span v-if="!unlocked" class="node-icon lock" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="11" width="14" height="11" rx="2"/>
        <path d="M8 11V7a4 4 0 018 0v4"/>
      </svg>
    </span>
    <span v-else-if="stars > 0" class="node-stars" aria-hidden="true">
      <svg v-for="i in stars" :key="i" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
    </span>
    <span v-else class="node-number">{{ level }}</span>
  </button>
</template>

<style scoped>
.map-node {
  width: 56px;
  height: 56px;
  border-radius: 50%;
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
  font-size: var(--app-font-size-lg);
}

.node-icon.lock {
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon.lock svg {
  width: 20px;
  height: 20px;
  color: var(--app-text-muted-on-surface);
}

.node-stars {
  display: flex;
  gap: 1px;
}

.star-icon {
  width: 14px;
  height: 14px;
  color: #ffc107;
}
</style>
