<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ active: boolean }>()

const particles = ref<{ id: number; color: string; left: string; delay: string; size: string; variant: number }[]>([])

const COLORS = ['#FFD54F', '#FF7043', '#AB47BC', '#42A5F5', '#66BB6A', '#EF5350', '#26C6DA', '#FFA726']
const COUNT = 28

function generate() {
  particles.value = Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    size: `${6 + Math.random() * 6}px`,
    variant: i % 4,
  }))
}

let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (props.active) {
    generate()
    timer = setTimeout(() => { particles.value = [] }, 3000)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div v-if="active" class="confetti-container" aria-hidden="true">
    <span
      v-for="p in particles"
      :key="p.id"
      class="confetti-particle"
      :class="`variant-${p.variant}`"
      :style="{
        '--color': p.color,
        '--left': p.left,
        '--delay': p.delay,
        '--size': p.size,
      }"
    />
  </div>
</template>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti-particle {
  position: absolute;
  top: -10px;
  left: var(--left);
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 2px;
  animation-delay: var(--delay);
  animation-fill-mode: forwards;
}

@media (prefers-reduced-motion: no-preference) {
  .variant-0 { animation: fall-0 2.2s ease-in forwards; }
  .variant-1 { animation: fall-1 2.4s ease-in forwards; }
  .variant-2 { animation: fall-2 2s ease-in forwards; border-radius: 50%; }
  .variant-3 { animation: fall-3 2.6s ease-in forwards; border-radius: 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .confetti-particle {
    animation: none;
    top: 20%;
    opacity: 0.6;
  }
}

@keyframes fall-0 {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

@keyframes fall-1 {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
  100% { transform: translateY(100vh) rotate(-540deg) translateX(40px); opacity: 0; }
}

@keyframes fall-2 {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(100vh) scale(0.5); opacity: 0; }
}

@keyframes fall-3 {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
  100% { transform: translateY(100vh) rotate(900deg) translateX(-30px); opacity: 0; }
}
</style>
