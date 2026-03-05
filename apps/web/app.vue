<template>
  <div class="app-root">
    <NuxtPage :key="$route.fullPath" />
  </div>
</template>

<style>
html {
  background: #000;
}

body {
  margin: 0;
}

.app-root {
  min-height: 100vh;
  background: var(--app-bg-fallback);
  background: var(--app-bg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  color: var(--app-text);
}
</style>
