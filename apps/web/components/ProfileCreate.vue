<script setup lang="ts">
import type { AvatarId } from '~/utils/profileSchema'

const AVATARS: { id: AvatarId; emoji: string }[] = [
  { id: 'default', emoji: '👤' },
  { id: 'star', emoji: '⭐' },
  { id: 'heart', emoji: '❤️' },
  { id: 'circle', emoji: '⭕' },
  { id: 'square', emoji: '⬜' },
]

const name = ref('')
const selectedAvatar = ref<AvatarId>('default')

const emit = defineEmits<{
  create: [name: string, avatarId: AvatarId]
  cancel: []
}>()

function submit() {
  emit('create', name.value.trim() || 'Player 1', selectedAvatar.value)
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="profile-create" role="dialog" aria-label="Create profile">
    <h3>New profile</h3>
    <label class="field">
      <span>Name</span>
      <input
        v-model="name"
        type="text"
        placeholder="Player 1"
        maxlength="50"
        aria-label="Profile name"
      />
    </label>
    <div class="avatars" role="group" aria-label="Choose avatar">
      <button
        v-for="a in AVATARS"
        :key="a.id"
        type="button"
        class="avatar-btn"
        :class="{ active: selectedAvatar === a.id }"
        :aria-label="`Avatar ${a.id}`"
        :aria-pressed="selectedAvatar === a.id"
        @click="selectedAvatar = a.id"
      >
        {{ a.emoji }}
      </button>
    </div>
    <div class="actions">
      <button type="button" class="btn" @click="cancel">Cancel</button>
      <button type="button" class="btn primary" @click="submit">Create</button>
    </div>
  </div>
</template>

<style scoped>
.profile-create {
  padding: 1rem;
  border: 2px solid var(--app-primary);
  border-radius: 0.5rem;
  background: var(--app-surface);
  margin-top: 0.75rem;
}
h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.field input {
  padding: 0.5rem;
  font-size: 1rem;
  min-height: 44px;
}
.avatars {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.avatar-btn {
  min-width: 48px;
  min-height: 48px;
  font-size: 1.5rem;
  border: 2px solid var(--app-muted);
  border-radius: 0.5rem;
  background: var(--app-surface);
  cursor: pointer;
}
.avatar-btn:hover {
  background: var(--app-surface-elevated);
}
.avatar-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.avatar-btn.active {
  border-color: var(--app-primary);
  background: rgba(0, 188, 212, 0.15);
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
.btn.primary {
  background: var(--app-primary);
  color: var(--app-text-on-surface);
  border: none;
}
.field input:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
</style>
