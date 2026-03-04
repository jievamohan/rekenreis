<template>
  <div class="app-root">
    <NuxtPage :key="$route.fullPath" />
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  background: var(--app-bg-fallback);
  background: var(--app-bg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  color: var(--app-text);
}
</style>
