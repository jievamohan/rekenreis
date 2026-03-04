<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="game-stage-card" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.game-stage-card {
  width: 100%;
  max-width: 36rem;
  flex: 1;
  background: var(--app-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-md);
  padding: var(--app-space-md);
  margin-bottom: var(--app-space-md);
}
</style>
