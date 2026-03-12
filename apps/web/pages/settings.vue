<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { useProfile } from '~/composables/useProfile'
import ParentGate from '~/components/ParentGate.vue'
import type { GameMode } from '~/types/game'

const { t } = useI18n()
const profile = useProfile()
const { logout } = useAuth()
const router = useRouter()

async function onLogout() {
  await logout()
  router.push('/login')
}
const unlocked = ref(false)

const difficultyCeiling = computed({
  get: () => profile.activeProfile.value?.prefs.difficultyCeiling ?? 'upTo10',
  set: (v: GameMode) => {
    const id = profile.activeProfile.value?.id
    if (id) profile.updateProfile(id, { prefs: { ...profile.activeProfile.value!.prefs, difficultyCeiling: v } })
  },
})
const hintsOn = computed({
  get: () => profile.activeProfile.value?.prefs.hintsOn ?? true,
  set: (v: boolean) => {
    const id = profile.activeProfile.value?.id
    if (id) profile.updateProfile(id, { prefs: { ...profile.activeProfile.value!.prefs, hintsOn: v } })
  },
})
const soundOn = computed({
  get: () => profile.activeProfile.value?.prefs.soundOn ?? true,
  set: (v: boolean) => {
    const id = profile.activeProfile.value?.id
    if (id) profile.updateProfile(id, { prefs: { ...profile.activeProfile.value!.prefs, soundOn: v } })
  },
})
const timersDisabled = computed({
  get: () => profile.activeProfile.value?.prefs.timersDisabled ?? false,
  set: (v: boolean) => {
    const id = profile.activeProfile.value?.id
    if (id) profile.updateProfile(id, { prefs: { ...profile.activeProfile.value!.prefs, timersDisabled: v } })
  },
})

function onUnlocked() {
  unlocked.value = true
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem('rekenreis_parent_gate')
    if (raw) {
      const ts = Number(raw)
      if (Number.isFinite(ts) && Date.now() - ts < 5 * 60 * 1000) {
        unlocked.value = true
      }
    }
  }
})
</script>

<template>
  <div class="settings-page">
    <h1>{{ t('settings.title') }}</h1>
    <ParentGate v-if="!unlocked" @unlocked="onUnlocked" />
    <div v-else class="settings-form">
      <label class="field">
        <span>{{ t('settings.difficultyCeiling') }}</span>
        <select v-model="difficultyCeiling">
          <option value="upTo10">{{ t('settings.upTo10') }}</option>
          <option value="upTo20">{{ t('settings.upTo20') }}</option>
        </select>
      </label>
      <label class="field">
        <input v-model="hintsOn" type="checkbox" />
        <span>{{ t('settings.showHints') }}</span>
      </label>
      <label class="field">
        <input v-model="soundOn" type="checkbox" />
        <span>{{ t('settings.soundEffects') }}</span>
      </label>
      <label class="field" data-testid="timer-toggle">
        <input v-model="timersDisabled" type="checkbox" />
        <span>{{ t('settings.disableTimers') }}</span>
      </label>
      <p v-if="timersDisabled" class="timer-help">
        {{ t('settings.disableTimersHelp') }}
      </p>
      <button type="button" class="logout-btn" @click="onLogout">
        Uitloggen
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: var(--app-space-md);
  max-width: 24rem;
  margin: 0 auto;
  font-family: var(--app-font);
}
h1 {
  font-size: var(--app-font-size-xl);
  margin-bottom: var(--app-space-md);
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-md);
  margin: var(--app-space-md) 0;
}
.field {
  display: flex;
  align-items: center;
  gap: var(--app-space-sm);
  min-height: var(--app-tap-min);
}
.field select {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm);
  font-family: var(--app-font);
  border-radius: var(--app-radius-sm);
}
.field select:focus-visible,
.field input:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.timer-help {
  font-size: 0.85rem;
  color: var(--app-text-muted, #78909c);
  margin: 0;
  padding-left: var(--app-space-sm);
}
.logout-btn {
  margin-top: var(--app-space-lg);
  min-height: var(--app-tap-min);
  padding: var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  background: transparent;
  color: var(--app-wrong);
  border: 2px solid var(--app-wrong);
  border-radius: var(--app-radius-md);
  cursor: pointer;
}
.logout-btn:hover {
  background: rgba(255, 138, 101, 0.2);
}
</style>
