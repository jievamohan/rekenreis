<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
</script>

<template>
  <div class="home">
    <h1>{{ t('index.welcome') }}</h1>
    <p class="intro">{{ t('index.intro') }}</p>
    <nav class="home-nav">
      <NuxtLink to="/start" class="nav-link nav-link-secondary">{{ t('index.checkConnection') }}</NuxtLink>
      <NuxtLink to="/play" class="nav-link nav-link-primary">{{ t('index.playGame') }}</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: var(--app-space-md);
  font-family: var(--app-font);
}
h1 {
  font-size: var(--app-font-size-2xl);
  margin-bottom: var(--app-space-sm);
}
.intro {
  margin: var(--app-space-sm) 0 var(--app-space-md);
  color: var(--app-text-muted);
  font-size: var(--app-font-size-lg);
}
.home-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-space-md);
}
.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--app-tap-min);
  min-width: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  text-decoration: none;
  border-radius: var(--app-radius-md);
  transition: background var(--app-transition), color var(--app-transition);
}
.nav-link-primary {
  color: var(--app-text-on-surface);
  background: var(--app-primary);
  border: none;
}
.nav-link-primary:hover {
  background: var(--app-primary-hover);
}
.nav-link-secondary {
  color: var(--app-primary);
  background: transparent;
  border: 2px solid var(--app-primary);
}
.nav-link-secondary:hover {
  background: rgba(0, 188, 212, 0.12);
}
.nav-link:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
</style>
