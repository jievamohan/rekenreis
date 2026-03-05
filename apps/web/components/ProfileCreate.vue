<script setup lang="ts">
import type { AvatarId } from '~/utils/profileSchema'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
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
  emit('create', name.value.trim() || t('common.player1'), selectedAvatar.value)
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="profile-create" role="dialog" :aria-label="t('profile.createTitle')">
    <h3>{{ t('profile.newProfile') }}</h3>
    <label class="field">
      <span>{{ t('profile.name') }}</span>
      <input
        v-model="name"
        type="text"
        :placeholder="t('common.player1')"
        maxlength="50"
        :aria-label="t('profile.profileName')"
      />
    </label>
    <div class="avatars" role="group" :aria-label="t('profile.chooseAvatar')">
      <button
        v-for="a in AVATARS"
        :key="a.id"
        type="button"
        class="avatar-btn"
        :class="{ active: selectedAvatar === a.id }"
        :aria-label="t('profile.avatarLabel', { id: a.id })"
        :aria-pressed="selectedAvatar === a.id"
        @click="selectedAvatar = a.id"
      >
        {{ a.emoji }}
      </button>
    </div>
    <div class="actions">
      <button type="button" class="btn" @click="cancel">{{ t('profile.cancel') }}</button>
      <button type="button" class="btn primary" @click="submit">{{ t('profile.create') }}</button>
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
