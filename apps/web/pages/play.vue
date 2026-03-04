<script setup lang="ts">
import type { GameMode } from '~/types/game'
import type { Level } from '~/types/level'
import { usePlayGame } from '~/composables/usePlayGame'
import { useSkin } from '~/composables/useSkin'
import levelsV1 from '~/content/levels.v1.json'

const route = useRoute()
const playSource = computed(() =>
  route.query.mode === 'pack' ? 'pack' : 'infinite'
)
const levelPack = computed(() =>
  playSource.value === 'pack' ? (levelsV1 as Level[]) : []
)

const mode = ref<GameMode>('upTo10')
const game = usePlayGame(mode, {
  source: playSource.value,
  levelPack: levelPack.value,
})

const skin = useSkin(route.query.skin as string | undefined)

const skinProps = computed(() => ({
  question: game.question.value,
  feedback: game.feedback.value,
  score: game.score.value,
  streak: game.streak.value,
  mode: mode.value,
  onAnswer: game.selectAnswer,
  onNext: game.nextQuestion,
  onModeChange: (m: GameMode) => {
    mode.value = m
  },
}))
</script>

<template>
  <component :is="skin.component" v-bind="skinProps" />
</template>
