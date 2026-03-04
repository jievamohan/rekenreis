<script setup lang="ts">
import type { AvatarId } from '~/utils/profileSchema'
import { useProfile } from '~/composables/useProfile'
import { useAppShell } from '~/composables/useAppShell'
import ProfileSelector from '~/components/ProfileSelector.vue'

const profile = useProfile()
const { getChooseGameHandler } = useAppShell()
const router = useRouter()
const route = useRoute()
const showProfileSelector = ref(false)

const navItems = [
  { to: '/stickers', label: 'Sticker book', icon: '📚' },
  { to: '/summary', label: 'Progress', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

function onChooseGame() {
  const handler = getChooseGameHandler()
  if (handler) {
    handler()
  } else {
    router.push('/play')
  }
}

function onProfileSwitch(id: string) {
  profile.switchProfile(id)
  showProfileSelector.value = false
}

function onProfileCreate(name: string, avatarId: AvatarId) {
  profile.createProfile(name, avatarId)
  showProfileSelector.value = false
}
</script>

<template>
  <div class="app-shell">
    <header class="app-top-bar" role="banner">
      <button
        type="button"
        class="profile-pill"
        aria-label="Switch profile"
        @click="showProfileSelector = true"
      >
        {{ profile.activeProfile.value?.name ?? 'Player 1' }}
      </button>
      <button
        type="button"
        class="choose-game-btn"
        aria-label="Choose game"
        @click="onChooseGame"
      >
        Choose game
      </button>
    </header>

    <div v-if="showProfileSelector" class="profile-overlay">
      <ProfileSelector
        :profiles="profile.profiles.value"
        :active-profile-id="profile.schema.value?.activeProfileId ?? ''"
        @switch="onProfileSwitch"
        @create="onProfileCreate"
      />
      <button type="button" class="close-btn" @click="showProfileSelector = false">
        Close
      </button>
    </div>

    <main class="app-stage">
      <GameStageCard>
        <slot />
      </GameStageCard>
    </main>

    <NavTabs :items="navItems" :active-path="route.path" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--app-space-sm);
}

.app-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-space-md);
  margin-bottom: var(--app-space-md);
  flex-shrink: 0;
}

.profile-pill {
  min-height: var(--app-tap-min);
  min-width: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
  background: var(--app-surface);
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-pill);
  box-shadow: var(--app-shadow-sm);
  cursor: pointer;
  transition: background var(--app-transition), transform var(--app-transition);
}

.profile-pill:hover {
  background: rgba(46, 125, 50, 0.08);
}

.profile-pill:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.choose-game-btn {
  min-height: var(--app-tap-min);
  min-width: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: white;
  background: var(--app-primary);
  border: none;
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
  cursor: pointer;
  transition: background var(--app-transition);
}

.choose-game-btn:hover {
  background: var(--app-primary-hover);
}

.choose-game-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.profile-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--app-space-lg);
}

.close-btn {
  margin-top: var(--app-space-md);
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  background: var(--app-surface);
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-md);
  cursor: pointer;
}

.app-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--app-space-sm);
}

</style>
