<script setup lang="ts">
import type { Waypoint } from '~/utils/mapWaypoints'

import seaweedSrc from '~/assets/graphics/objects/seaweed.svg'
import coralSrc from '~/assets/graphics/objects/coral.svg'
import shellSrc from '~/assets/graphics/objects/shell.svg'
import starfishSrc from '~/assets/graphics/objects/starfish.svg'
import fishSrc from '~/assets/graphics/objects/fish-small.svg'
import bubblesSrc from '~/assets/graphics/objects/bubbles.svg'
import jellyfishSrc from '~/assets/graphics/objects/jellyfish.svg'
import crabSrc from '~/assets/graphics/objects/crab.svg'

const props = defineProps<{
  waypoints: Waypoint[]
  mapHeight: number
}>()

interface Decor {
  src: string
  x: number
  y: number
  width: number
  height: number
  rotate: number
  opacity: number
  flip: boolean
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const catalog = [
  { src: seaweedSrc, w: 28, h: 64, edge: true },
  { src: coralSrc, w: 48, h: 42, edge: true },
  { src: shellSrc, w: 24, h: 20, edge: false },
  { src: starfishSrc, w: 28, h: 28, edge: false },
  { src: fishSrc, w: 36, h: 22, edge: false },
  { src: bubblesSrc, w: 30, h: 40, edge: false },
  { src: jellyfishSrc, w: 28, h: 36, edge: false },
  { src: crabSrc, w: 32, h: 24, edge: false },
]

const items = computed(() => {
  const rng = mulberry32(137)
  const decorations: Decor[] = []
  const h = props.mapHeight
  const count = Math.floor(h / 25)

  for (let i = 0; i < count; i++) {
    const y = 30 + rng() * (h - 80)
    const xPct = Math.max(1, Math.min(99, rng() * 100))

    const entry = catalog[Math.floor(rng() * catalog.length)]
    const scale = 0.7 + rng() * 0.6

    decorations.push({
      src: entry.src,
      x: xPct,
      y,
      width: entry.w * scale,
      height: entry.h * scale,
      rotate: (rng() - 0.5) * 30,
      opacity: 0.25 + rng() * 0.35,
      flip: rng() > 0.5,
    })
  }
  return decorations
})
</script>

<template>
  <div class="map-decor" aria-hidden="true">
    <img
      v-for="(d, idx) in items"
      :key="idx"
      :src="d.src"
      alt=""
      class="decor-item"
      :style="{
        left: `${d.x}%`,
        top: `${d.y}px`,
        width: `${d.width}px`,
        height: `${d.height}px`,
        opacity: d.opacity,
        transform: `translate(-50%, -50%) rotate(${d.rotate}deg)${d.flip ? ' scaleX(-1)' : ''}`,
      }"
    >
  </div>
</template>

<style scoped>
.map-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.decor-item {
  position: absolute;
  will-change: transform;
}
</style>
