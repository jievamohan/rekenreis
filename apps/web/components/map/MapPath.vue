<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ nodeCount: number }>()

const pathRef = ref<SVGPathElement | null>(null)
const pathLength = ref(0)
const drawn = ref(false)

const viewWidth = 300
const viewHeight = computed(() => Math.max(400, props.nodeCount * 80 + 60))

const pathD = computed(() => {
  const points: string[] = []
  const centerX = viewWidth / 2
  const startY = 40
  const spacing = 80

  for (let i = 0; i < props.nodeCount; i++) {
    const y = startY + i * spacing
    const offsetX = (i % 2 === 0 ? -1 : 1) * 50
    const x = centerX + offsetX

    if (i === 0) {
      points.push(`M ${x} ${y}`)
    } else {
      const prevY = startY + (i - 1) * spacing
      const prevOffsetX = ((i - 1) % 2 === 0 ? -1 : 1) * 50
      const prevX = centerX + prevOffsetX
      const cpY = prevY + spacing / 2
      points.push(`C ${prevX} ${cpY}, ${x} ${cpY}, ${x} ${y}`)
    }
  }
  return points.join(' ')
})

onMounted(() => {
  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength()
    requestAnimationFrame(() => { drawn.value = true })
  }
})
</script>

<template>
  <svg
    class="map-path-svg"
    :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <path
      :d="pathD"
      fill="none"
      :stroke="'var(--app-map-path)'"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      ref="pathRef"
      :d="pathD"
      fill="none"
      :stroke="'var(--app-map-path-edge)'"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="path-animated"
      :class="{ drawn }"
      :style="pathLength ? { '--path-len': pathLength } : {}"
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

.path-animated {
  stroke-dasharray: var(--path-len, 1000);
  stroke-dashoffset: var(--path-len, 1000);
  transition: none;
}

@media (prefers-reduced-motion: no-preference) {
  .path-animated.drawn {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.8s ease-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .path-animated {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}
</style>
