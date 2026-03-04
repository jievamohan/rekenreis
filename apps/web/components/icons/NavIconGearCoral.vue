<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="nav-icon-svg" v-bind="$attrs">
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
</template>

<style scoped>
.nav-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
