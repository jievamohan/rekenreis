<script setup lang="ts">
import { computed } from 'vue'
import { useMaatje } from '~/composables/useMaatje'
import type { ExpressionId, MaatjeId } from '~/types/maatje'

const props = withDefaults(
  defineProps<{
    character: MaatjeId
    expression: ExpressionId
    /** sm 40px, md 64px, lg 80px, xl 96px, 2xl 140px, modal 270px high */
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'modal'
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
    case 'xl':
      return 96
    case '2xl':
      return 140
    case 'modal':
      return 270
    default:
      return 64
  }
})

const isModal = computed(() => props.size === 'modal')
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :width="isModal ? undefined : sizePx"
    :height="isModal ? undefined : sizePx"
    :class="['maatje-avatar', { 'maatje-avatar--modal': isModal }]"
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

.maatje-avatar--modal {
  width: 100%;
  height: 270px;
  object-fit: cover;
  object-position: center;
}
</style>
