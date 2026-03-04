<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <button
    type="button"
    class="app-btn-primary"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
