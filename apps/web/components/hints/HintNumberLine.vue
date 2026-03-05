<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const props = defineProps<{
  a: number
  b: number
  correctAnswer: number
}>()

const max = computed(() => Math.max(20, props.a + props.b + 2))
const scale = computed(() => 100 / max.value)
</script>

<template>
  <div
    class="hint-number-line"
    role="img"
    :aria-label="t('hints.numberLine', { max, a, b, answer: correctAnswer })"
  >
    <div class="line">
      <span
        v-for="n in max + 1"
        :key="n - 1"
        class="tick"
        :style="{ left: `${(n - 1) * scale}%` }"
      >
        {{ n - 1 }}
      </span>
      <span
        class="marker a"
        :style="{ left: `${a * scale}%` }"
        :aria-hidden="true"
      >
        a
      </span>
      <span
        class="marker b"
        :style="{ left: `${(a + b) * scale}%` }"
        :aria-hidden="true"
      >
        a+b
      </span>
    </div>
  </div>
</template>

<style scoped>
.hint-number-line {
  margin: 0.75rem 0;
}
.line {
  position: relative;
  height: 2rem;
  border-bottom: 2px solid var(--app-muted);
}
.tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem;
  bottom: -1.25rem;
}
.marker {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  top: -1rem;
}
.marker.a {
  color: var(--app-primary);
}
.marker.b {
  color: var(--app-correct);
}
</style>
