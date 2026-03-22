<template>
  <div class="start">
    <h1>API Health</h1>
    <pre v-if="health">{{ JSON.stringify(health, null, 2) }}</pre>
    <p v-else-if="error" class="error">{{ error }}</p>
    <p v-else class="loading">Loading...</p>
  </div>
</template>

<script setup lang="ts">
const { data: health, error } = await useAsyncData('health', () =>
  $fetch<Record<string, unknown>>('/api/health')
)
</script>

<style scoped>
.start {
  padding: 2rem;
}
pre {
  text-align: left;
  overflow-x: auto;
}
.loading {
  color: #888;
}
.error {
  color: #c00;
}
</style>
