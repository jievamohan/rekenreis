<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  generateWaypoints,
  waypointsToPathD,
  computeMapHeight,
  MAP_VIEW_WIDTH,
  MAP_PATH_WIDTH,
} from '~/utils/mapWaypoints'

const props = defineProps<{ nodeCount: number }>()

const surfaceRef = ref<SVGPathElement | null>(null)
const pathLength = ref(0)
const drawn = ref(false)

const waypoints = computed(() => generateWaypoints(props.nodeCount))
const viewHeight = computed(() => computeMapHeight(waypoints.value))
const pathD = computed(() => waypointsToPathD(waypoints.value))

const borderWidth = MAP_PATH_WIDTH
const surfaceWidth = MAP_PATH_WIDTH - 6

onMounted(() => {
  if (surfaceRef.value) {
    pathLength.value = surfaceRef.value.getTotalLength()
    requestAnimationFrame(() => { drawn.value = true })
  }
})
</script>

<template>
  <svg
    class="map-path-svg"
    :viewBox="`0 0 ${MAP_VIEW_WIDTH} ${viewHeight}`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <!-- Trail border — always visible -->
    <path
      :d="pathD"
      fill="none"
      stroke="var(--app-map-trail-edge)"
      :stroke-width="borderWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Trail surface — draws in -->
    <path
      ref="surfaceRef"
      :d="pathD"
      fill="none"
      stroke="var(--app-map-trail)"
      :stroke-width="surfaceWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="trail-surface"
      :class="{ drawn }"
      :style="pathLength ? { '--path-len': pathLength } : {}"
    />
    <!-- Subtle dashed center guideline -->
    <path
      :d="pathD"
      fill="none"
      stroke="var(--app-map-path-edge)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="6 14"
      opacity="0.35"
    />
  </svg>
</template>

<style scoped>
.map-path-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.trail-surface {
  stroke-dasharray: var(--path-len, 9999);
  stroke-dashoffset: var(--path-len, 9999);
  transition: none;
}

@media (prefers-reduced-motion: no-preference) {
  .trail-surface.drawn {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1.2s ease-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trail-surface {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}
</style>
