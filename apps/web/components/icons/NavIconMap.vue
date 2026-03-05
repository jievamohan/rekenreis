<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="nav-icon-svg" v-bind="$attrs">
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/>
    <path d="M9 3v15"/>
    <path d="M15 6v15"/>
  </svg>
</template>

<style scoped>
.nav-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
