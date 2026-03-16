<script setup lang="ts">
import MaatjeAvatar from '~/components/characters/MaatjeAvatar.vue'
import PrimaryButton from '~/components/PrimaryButton.vue'
import { useI18n } from '~/composables/useI18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

function onBackToMap() {
  router.push('/map')
}
</script>

<template>
  <div class="locked-level-screen" role="region" :aria-label="t('lockedLevel.ariaLabel')">
    <div class="locked-level-content">
      <MaatjeAvatar
        character="wolkje"
        expression="nadenken"
        size="xl"
        :aria-label="t('lockedLevel.maatjeAlt')"
      />
      <h2 class="locked-level-title">{{ t('lockedLevel.title') }}</h2>
      <p class="locked-level-subtitle">{{ t('lockedLevel.subtitle') }}</p>
      <PrimaryButton
        class="locked-level-cta"
        :aria-label="t('lockedLevel.backToMapAria')"
        @click="onBackToMap"
      >
        {{ t('lockedLevel.backToMap') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.locked-level-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: var(--app-space-lg);
}

.locked-level-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-space-md);
  max-width: 400px;
  text-align: center;
}

.locked-level-title {
  font-family: var(--app-font-display);
  font-size: 1.5rem;
  margin: 0;
  color: var(--app-fg);
}

.locked-level-subtitle {
  font-size: 1rem;
  margin: 0;
  color: var(--app-fg-muted);
  line-height: 1.4;
}

.locked-level-cta {
  min-height: var(--app-tap-min);
  margin-top: var(--app-space-sm);
}
</style>
