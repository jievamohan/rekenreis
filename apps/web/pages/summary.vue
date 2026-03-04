<script setup lang="ts">
import { useProfile } from '~/composables/useProfile'
import { useProgressSummary } from '~/composables/useProgressSummary'

const profile = useProfile()
const summary = useProgressSummary(profile)

const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const modeLabel = computed(() => {
  const m = summary.favoriteMode.value
  if (m === 'classic') return 'Classic'
  if (m === 'timed-pop') return 'Timed Pop'
  if (m === 'build-bridge') return 'Build Bridge'
  return m
})

async function onCopy() {
  copyStatus.value = 'idle'
  const ok = await summary.copyToClipboard()
  copyStatus.value = ok ? 'success' : 'error'
  if (ok) setTimeout(() => { copyStatus.value = 'idle' }, 2000)
}

function onDownload() {
  summary.downloadJson()
}
</script>

<template>
  <div class="summary-page">
    <h1>Progress Summary</h1>
    <p class="intro">A parent-friendly overview of play progress. All data stays on this device.</p>

    <div class="metrics" role="region" aria-label="Progress metrics">
      <div class="metric">
        <span class="label">Rounds today</span>
        <span class="value">{{ summary.roundsToday }}</span>
      </div>
      <div class="metric">
        <span class="label">Total rounds</span>
        <span class="value">{{ summary.roundsTotal }}</span>
      </div>
      <div class="metric">
        <span class="label">Accuracy</span>
        <span class="value">{{ summary.accuracy }}%</span>
      </div>
      <div class="metric">
        <span class="label">Favorite mode</span>
        <span class="value">{{ modeLabel }}</span>
      </div>
    </div>

    <div class="export-actions">
      <button type="button" class="btn" @click="onCopy">
        {{ copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : 'Copy summary' }}
      </button>
      <button type="button" class="btn" @click="onDownload">
        Download JSON
      </button>
    </div>

    <p class="privacy">Export contains no personal identifiers. Safe to share with teachers or caregivers.</p>

    <NuxtLink to="/play" class="back">Back to game</NuxtLink>
  </div>
</template>

<style scoped>
.summary-page {
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
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.metric {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
}
.metric .label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}
.metric .value {
  font-size: 1.25rem;
  font-weight: 600;
}
.export-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #06c;
  border-radius: 0.5rem;
  background: #e6f2ff;
  cursor: pointer;
}
.btn:hover {
  background: #cce5ff;
}
.btn:focus-visible {
  outline: 2px solid #06c;
  outline-offset: 2px;
}
.privacy {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1rem;
}
.back {
  display: inline-block;
}
</style>
