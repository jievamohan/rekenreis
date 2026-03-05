<script setup lang="ts">
import { useProfile } from '~/composables/useProfile'
import ParentGate from '~/components/ParentGate.vue'
import type { GameMode } from '~/types/game'

const profile = useProfile()
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
    <h1>Settings</h1>
    <ParentGate v-if="!unlocked" @unlocked="onUnlocked" />
    <div v-else class="settings-form">
      <label class="field">
        <span>Difficulty ceiling</span>
        <select v-model="difficultyCeiling">
          <option value="upTo10">Up to 10</option>
          <option value="upTo20">Up to 20</option>
        </select>
      </label>
      <label class="field">
        <input v-model="hintsOn" type="checkbox" />
        <span>Show hints when stuck</span>
      </label>
      <label class="field">
        <input v-model="soundOn" type="checkbox" />
        <span>Sound effects</span>
      </label>
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
</style>
