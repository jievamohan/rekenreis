<script setup lang="ts">
const api = useApi()
const { data, error } = await useAsyncData('health', () => api.fetchHealth())
</script>

<template>
  <div>
    <h1>Start</h1>
    <div v-if="error" class="error" role="alert">
      <p>Unable to connect to the API. The math game works without it—visit <NuxtLink to="/play">/play</NuxtLink> to play.</p>
    </div>
    <pre v-else-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
    <p v-else>Loading...</p>
  </div>
</template>
