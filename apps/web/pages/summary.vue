<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useProfile } from '~/composables/useProfile'
import { useProgressSummary } from '~/composables/useProgressSummary'

const { t } = useI18n()
const profile = useProfile()
const summary = useProgressSummary(profile)

const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const modeLabel = computed(() => {
  const m = summary.favoriteMode.value
  if (m === 'classic') return t('modes.classic')
  if (m === 'timed-pop') return t('modes.timedPop')
  if (m === 'build-bridge') return t('modes.buildBridge')
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
    <h1>{{ t('summary.title') }}</h1>
    <p class="intro">{{ t('summary.intro') }}</p>

    <div class="metrics" role="region" :aria-label="t('summary.progressMetrics')">
      <div class="metric">
        <span class="label">{{ t('summary.roundsToday') }}</span>
        <span class="value">{{ summary.roundsToday }}</span>
      </div>
      <div class="metric">
        <span class="label">{{ t('summary.totalRounds') }}</span>
        <span class="value">{{ summary.roundsTotal }}</span>
      </div>
      <div class="metric">
        <span class="label">{{ t('summary.accuracy') }}</span>
        <span class="value">{{ summary.accuracy }}%</span>
      </div>
      <div class="metric">
        <span class="label">{{ t('summary.favoriteMode') }}</span>
        <span class="value">{{ modeLabel }}</span>
      </div>
    </div>

    <div class="export-actions">
      <PrimaryButton @click="onCopy">
        {{ copyStatus === 'success' ? t('summary.copied') : copyStatus === 'error' ? t('summary.copyFailed') : t('summary.copyToClipboard') }}
      </PrimaryButton>
      <SecondaryButton @click="onDownload">
        {{ t('summary.saveAsFile') }}
      </SecondaryButton>
    </div>

    <p class="privacy">{{ t('summary.privacyNote') }}</p>

  </div>
</template>

<style scoped>
.summary-page {
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
  margin-bottom: var(--app-space-lg);
  font-size: 0.95rem;
}
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--app-space-md);
  margin-bottom: var(--app-space-lg);
}
.metric {
  padding: var(--app-space-md);
  background: rgba(0, 188, 212, 0.08);
  border-radius: var(--app-radius-md);
}
.metric .label {
  display: block;
  font-size: 0.85rem;
  color: var(--app-text-muted);
  margin-bottom: var(--app-space-xs);
}
.metric .value {
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
}
.export-actions {
  display: flex;
  gap: var(--app-space-md);
  margin-bottom: var(--app-space-md);
}
.privacy {
  font-size: 0.8rem;
  color: var(--app-text-muted);
  margin-bottom: var(--app-space-md);
}
</style>
