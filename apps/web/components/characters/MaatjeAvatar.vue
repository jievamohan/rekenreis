<script setup lang="ts">
import { computed } from 'vue'
import { useMaatje } from '~/composables/useMaatje'
import type { ExpressionId, MaatjeId } from '~/types/maatje'

const props = withDefaults(
  defineProps<{
    character: MaatjeId
    expression: ExpressionId
    /** sm 40px, md 64px, lg 80px */
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
  }>(),
  { size: 'md' }
)

const { resolve } = useMaatje()

const src = computed(() => resolve(props.character, props.expression))

const sizePx = computed(() => {
  switch (props.size) {
    case 'sm':
      return 40
    case 'md':
      return 64
    case 'lg':
      return 80
    default:
      return 64
  }
})
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :width="sizePx"
    :height="sizePx"
    class="maatje-avatar"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : true"
    alt=""
  />
</template>

<style scoped>
.maatje-avatar {
  display: block;
  object-fit: contain;
}
</style>
