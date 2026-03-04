<script setup lang="ts">
import type { SkinRoundProps } from '~/types/skin'
import type { SkinId } from '~/utils/skinResolver'
import { useSkin } from '~/composables/useSkin'

const props = defineProps<
  SkinRoundProps & { effectiveSkinId: SkinId; recordTimeout?: () => void }
>()
const skin = useSkin(props.effectiveSkinId)
const skinProps = {
  question: props.question,
  feedback: props.feedback,
  score: props.score,
  streak: props.streak,
  mode: props.mode,
  onAnswer: props.onAnswer,
  onNext: props.onNext,
  onModeChange: props.onModeChange,
}
</script>

<template>
  <component :is="skin.component" v-bind="skinProps" />
</template>
