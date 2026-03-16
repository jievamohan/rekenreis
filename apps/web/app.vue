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
  /* Prevent double-tap zoom on iOS Safari */
  touch-action: manipulation;
}

* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  touch-action: manipulation;
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
