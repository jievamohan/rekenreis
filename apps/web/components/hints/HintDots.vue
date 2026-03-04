<script setup lang="ts">
defineProps<{
  a: number
  b: number
  correctAnswer: number
}>()
</script>

<template>
  <div
    class="hint-dots"
    role="img"
    :aria-label="`${a} dots plus ${b} dots equals ${correctAnswer}`"
  >
    <span class="group" :aria-hidden="true">
      <span v-for="i in a" :key="i" class="dot" aria-hidden="true">●</span>
    </span>
    <span class="op" aria-hidden="true">+</span>
    <span class="group" :aria-hidden="true">
      <span v-for="i in b" :key="`b-${i}`" class="dot" aria-hidden="true">●</span>
    </span>
    <span class="op" aria-hidden="true">=</span>
    <span class="result" aria-hidden="true">?</span>
  </div>
</template>

<style scoped>
.hint-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 1.25rem;
  margin: 0.75rem 0;
}
.hint-dots .group {
  display: inline-flex;
  gap: 0.15rem;
}
.hint-dots .dot {
  color: #06c;
}
.hint-dots .op {
  color: #333;
  font-weight: 600;
}
.hint-dots .result {
  color: #666;
}
</style>
