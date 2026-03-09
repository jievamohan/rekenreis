<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useMaatje } from '~/composables/useMaatje'
import MaatjeAvatar from '~/components/characters/MaatjeAvatar.vue'

const { t } = useI18n()
const api = useApi()
const { data, error } = await useAsyncData('health', () => api.fetchHealth())

const { resolve } = useMaatje()
const maatjeSrc = computed(() => resolve('wolkje', 'neutraal'))
const showMaatje = computed(() => !!maatjeSrc.value)
</script>

<template>
  <div class="start-page">
    <MaatjeAvatar
      v-if="showMaatje"
      character="wolkje"
      expression="neutraal"
      size="md"
      class="start-maatje"
      :aria-label="t('start.maatjeAlt')"
    />
    <h1>{{ t('start.title') }}</h1>
    <div v-if="error" class="error" role="alert">
      <p>{{ t('start.error') }} <NuxtLink to="/play" class="start-link">/play</NuxtLink> {{ t('start.errorSuffix') }}</p>
    </div>
    <pre v-else-if="data" class="health-json">{{ JSON.stringify(data, null, 2) }}</pre>
    <p v-else class="loading">{{ t('start.loading') }}</p>
  </div>
</template>

<style scoped>
.start-page {
  font-family: var(--app-font);
}

.start-maatje {
  margin-bottom: var(--app-space-sm);
}
h1 {
  font-size: var(--app-font-size-xl);
  margin-bottom: var(--app-space-md);
}
.error {
  color: var(--app-wrong);
}
.start-link {
  color: var(--app-primary);
  font-weight: var(--app-font-weight-bold);
}
.start-link:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.health-json,
.loading {
  font-family: var(--app-font);
  color: var(--app-text);
}
</style>
