<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import NavIconFish from '~/components/icons/NavIconFish.vue'
import NavIconChartBubbles from '~/components/icons/NavIconChartBubbles.vue'
import NavIconGearCoral from '~/components/icons/NavIconGearCoral.vue'
import NavIconMap from '~/components/icons/NavIconMap.vue'

const { t } = useI18n()
defineProps<{
  items: { to: string; label: string; icon: string }[]
  activePath?: string
}>()

const iconComponents: Record<string, typeof NavIconFish> = {
  fish: NavIconFish,
  'chart-bubbles': NavIconChartBubbles,
  'gear-coral': NavIconGearCoral,
  map: NavIconMap,
}
</script>

<template>
  <nav class="nav-tabs" role="navigation" :aria-label="t('nav.mainNavigation')">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-tab"
      :class="{ active: ($props.activePath ?? '') === item.to }"
      :aria-current="($props.activePath ?? '') === item.to ? 'page' : undefined"
      :aria-label="item.label"
    >
      <span class="nav-icon" aria-hidden="true">
        <component :is="iconComponents[item.icon] ?? null" v-if="iconComponents[item.icon]" />
        <span v-else>{{ item.icon }}</span>
      </span>
      <span class="nav-label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.nav-tabs {
  display: flex;
  justify-content: center;
  gap: var(--app-space-sm);
  flex-shrink: 0;
  padding: var(--app-space-sm) 0;
  position: relative;
  z-index: 1;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: var(--app-tap-min);
  min-width: 4rem;
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-normal);
  color: var(--app-text-muted);
  text-decoration: none;
  border-radius: var(--app-radius-md);
  transition: background var(--app-transition), color var(--app-transition);
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--app-text);
}

.nav-tab.active {
  background: rgba(0, 188, 212, 0.2);
  color: var(--app-primary);
}

.nav-tab:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.nav-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.nav-label {
  font-size: 0.8rem;
}
</style>
