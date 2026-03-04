<script setup lang="ts">
import type { ProfileData, AvatarId } from '~/utils/profileSchema'
import ProfileCreate from './ProfileCreate.vue'

function avatarEmoji(id: string): string {
  const map: Record<string, string> = {
    default: '👤',
    star: '⭐',
    heart: '❤️',
    circle: '⭕',
    square: '⬜',
  }
  return map[id] ?? '👤'
}

const props = defineProps<{
  profiles: ProfileData[]
  activeProfileId: string
}>()

const emit = defineEmits<{
  switch: [id: string]
  create: [name: string, avatarId: AvatarId]
}>()

const showCreate = ref(false)

function onSelect(id: string) {
  emit('switch', id)
}

function onCreate(name: string, avatarId: AvatarId) {
  emit('create', name, avatarId)
  showCreate.value = false
}
</script>

<template>
  <div class="profile-selector" role="region" aria-label="Select profile">
    <h2>Who is playing?</h2>
    <ul class="profile-list" role="list">
      <li v-for="p in profiles" :key="p.id">
        <button
          type="button"
          class="profile-btn"
          :class="{ active: p.id === activeProfileId }"
          :aria-label="`Select ${p.name}`"
          :aria-pressed="p.id === activeProfileId"
          @click="onSelect(p.id)"
        >
          <span class="avatar" :aria-hidden="true">{{ avatarEmoji(p.avatarId) }}</span>
          <span class="name">{{ p.name }}</span>
        </button>
      </li>
      <li v-if="!showCreate">
        <button
          type="button"
          class="profile-btn add"
          aria-label="Add new profile"
          @click="showCreate = true"
        >
          + Add
        </button>
      </li>
    </ul>
    <ProfileCreate
      v-if="showCreate"
      @create="onCreate"
      @cancel="showCreate = false"
    />
  </div>
</template>

<style scoped>
.profile-selector {
  padding: 1rem;
  max-width: 24rem;
  margin: 0 auto;
}
h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.profile-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.profile-btn {
  min-height: 48px;
  min-width: 48px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--app-muted);
  border-radius: 0.5rem;
  background: var(--app-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.profile-btn:hover {
  background: var(--app-surface-elevated);
}
.profile-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.profile-btn.active {
  border-color: var(--app-primary);
  background: rgba(0, 188, 212, 0.15);
}
.profile-btn.add {
  justify-content: center;
}
.avatar {
  font-size: 1.5rem;
}
</style>
