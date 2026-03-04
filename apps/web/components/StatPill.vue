<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<template>
  <div class="stat-pill" role="status">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.stat-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-height: var(--app-tap-min);
  min-width: 4rem;
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  background: var(--app-surface);
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-pill);
  box-shadow: var(--app-shadow-sm);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}

.stat-value {
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
}
</style>
