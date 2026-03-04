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
    <NuxtLink to="/summary" class="back">Progress summary</NuxtLink>
    <NuxtLink to="/play" class="back">Back to game</NuxtLink>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 1rem;
  max-width: 24rem;
  margin: 0 auto;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}
.field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
}
.field select {
  min-height: 44px;
  padding: 0.5rem;
}
.back {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  margin-top: 1rem;
}
</style>
