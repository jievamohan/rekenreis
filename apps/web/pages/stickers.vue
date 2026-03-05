<script setup lang="ts">
import type { SkinId } from '~/utils/skinResolver'
import { useI18n } from '~/composables/useI18n'
import { useProfile } from '~/composables/useProfile'
import { useRewards } from '~/composables/useRewards'
import { STICKER_CATEGORIES, UNLOCK_THRESHOLDS } from '~/utils/rewardsConfig'

const { t } = useI18n()
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
    <h1>{{ t('stickers.title') }}</h1>
    <p class="intro">{{ t('stickers.intro', { score: bestScore }) }}</p>
    <div v-for="cat in STICKER_CATEGORIES" :key="cat.id" class="category">
      <h2>{{ t(cat.label) }}</h2>
      <div class="stickers">
        <div
          v-for="id in cat.stickerIds"
          :key="id"
          class="sticker"
          :class="{ locked: !isUnlocked(id), new: newlyUnlocked.has(id) }"
          role="img"
          :aria-label="isUnlocked(id) ? t('stickers.unlocked', { id }) : t('stickers.locked', { id, threshold: UNLOCK_THRESHOLDS[id] })"
        >
          <span v-if="isUnlocked(id)" class="sticker-icon">{{ id === 'classic' ? '📐' : id === 'monster-feed' ? '🦖' : id === 'space' ? '🚀' : '🏴‍☠️' }}</span>
          <span v-else class="sticker-lock" aria-hidden="true">🔒</span>
          <span class="sticker-label">{{ id }}</span>
          <span v-if="newlyUnlocked.has(id)" class="new-badge">{{ t('stickers.new') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stickers-page {
  padding: var(--app-space-md);
  max-width: 28rem;
  margin: 0 auto;
  font-family: var(--app-font);
}
h1 {
  font-size: var(--app-font-size-xl);
  margin-bottom: var(--app-space-sm);
}
.intro {
  color: var(--app-text-muted);
  margin-bottom: var(--app-space-md);
}
.category {
  margin-bottom: var(--app-space-lg);
}
.category h2 {
  font-size: var(--app-font-size-lg);
  margin-bottom: var(--app-space-sm);
}
.stickers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-space-md);
}
.sticker {
  position: relative;
  width: 5rem;
  padding: var(--app-space-md);
  border: 2px solid var(--app-text);
  border-radius: var(--app-radius-md);
  background: var(--app-surface);
  text-align: center;
}
.sticker.locked {
  opacity: 0.6;
  border-color: var(--app-muted);
}
.sticker.new {
  border-color: var(--app-primary);
  box-shadow: 0 0 0 2px var(--app-primary);
}
.sticker-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: var(--app-space-xs);
}
.sticker-lock {
  font-size: 1.5rem;
  display: block;
  margin-bottom: var(--app-space-xs);
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
  background: var(--app-primary);
  color: var(--app-text-on-surface);
  padding: 0.15rem 0.35rem;
  border-radius: var(--app-radius-sm);
}
</style>
