<script setup lang="ts">
import type { SkinId } from '~/utils/skinResolver'
import { useProfile } from '~/composables/useProfile'
import { useRewards } from '~/composables/useRewards'
import { STICKER_CATEGORIES, UNLOCK_THRESHOLDS } from '~/utils/rewardsConfig'

const profile = useProfile()
const currentScore = ref(0)
const { bestScore, isUnlocked } = useRewards(currentScore, profile)

const newlyUnlocked = ref<Set<SkinId>>(new Set())
const prevBestScore = ref<number | null>(null)

watch(bestScore, (score, oldScore) => {
  const prev = oldScore ?? prevBestScore.value
  if (prev === null) {
    prevBestScore.value = score
    return
  }
  if (score > prev) {
    const ids = [...STICKER_CATEGORIES.flatMap((c) => c.stickerIds)]
    ids.filter((id) => UNLOCK_THRESHOLDS[id] <= score && UNLOCK_THRESHOLDS[id] > prev).forEach((id) =>
      newlyUnlocked.value.add(id)
    )
  }
  prevBestScore.value = score
}, { immediate: true })
</script>

<template>
  <div class="stickers-page">
    <h1>Sticker Book</h1>
    <p class="intro">Play to collect stickers! Your best score so far: {{ bestScore }}.</p>
    <NuxtLink to="/play" class="back">Back to game</NuxtLink>

    <div v-for="cat in STICKER_CATEGORIES" :key="cat.id" class="category">
      <h2>{{ cat.label }}</h2>
      <div class="stickers">
        <div
          v-for="id in cat.stickerIds"
          :key="id"
          class="sticker"
          :class="{ locked: !isUnlocked(id), new: newlyUnlocked.has(id) }"
          role="img"
          :aria-label="isUnlocked(id) ? `Unlocked: ${id}` : `${id} locked (score ${UNLOCK_THRESHOLDS[id]} to unlock)`"
        >
          <span v-if="isUnlocked(id)" class="sticker-icon">{{ id === 'classic' ? '📐' : id === 'monster-feed' ? '🦖' : id === 'space' ? '🚀' : '🏴‍☠️' }}</span>
          <span v-else class="sticker-lock" aria-hidden="true">🔒</span>
          <span class="sticker-label">{{ id }}</span>
          <span v-if="newlyUnlocked.has(id)" class="new-badge">New!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stickers-page {
  padding: 1rem;
  max-width: 28rem;
  margin: 0 auto;
  font-family: system-ui, sans-serif;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.intro {
  color: #666;
  margin-bottom: 1rem;
}
.back {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
  color: #06c;
}
.category {
  margin-bottom: 1.5rem;
}
.category h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.stickers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.sticker {
  position: relative;
  width: 5rem;
  padding: 0.75rem;
  border: 2px solid #333;
  border-radius: 0.5rem;
  background: #fff;
  text-align: center;
}
.sticker.locked {
  opacity: 0.6;
  border-color: #999;
}
.sticker.new {
  border-color: #06c;
  box-shadow: 0 0 0 2px #06c;
}
.sticker-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.25rem;
}
.sticker-lock {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.25rem;
}
.sticker-label {
  font-size: 0.8rem;
  text-transform: capitalize;
}
.new-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  font-size: 0.65rem;
  background: #06c;
  color: #fff;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
}
</style>
