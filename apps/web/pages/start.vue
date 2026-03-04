<script setup lang="ts">
const api = useApi()
const { data, error } = await useAsyncData('health', () => api.fetchHealth())
</script>

<template>
  <div class="start-page">
    <h1>Start</h1>
    <div v-if="error" class="error" role="alert">
      <p>Unable to connect to the API. The math game works without it—visit <NuxtLink to="/play" class="start-link">/play</NuxtLink> to play.</p>
    </div>
    <pre v-else-if="data" class="health-json">{{ JSON.stringify(data, null, 2) }}</pre>
    <p v-else class="loading">Loading...</p>
  </div>
</template>

<style scoped>
.start-page {
  font-family: var(--app-font);
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
