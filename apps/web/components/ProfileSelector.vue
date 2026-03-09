<script setup lang="ts">
import type { ProfileData } from '~/utils/profileSchema'
import type { MaatjeId } from '~/types/maatje'
import MaatjeAvatar from '~/components/characters/MaatjeAvatar.vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const props = defineProps<{
  profiles: ProfileData[]
  activeProfileId: string
}>()

const emit = defineEmits<{
  switch: [id: string]
  create: [name: string, maatjeId: MaatjeId]
}>()

const showCreate = ref(false)

function onSelect(id: string) {
  emit('switch', id)
}

function onCreate(name: string, maatjeId: MaatjeId) {
  emit('create', name, maatjeId)
  showCreate.value = false
}

function maatjeForProfile(p: ProfileData): MaatjeId {
  return p.maatjeId ?? 'wolkje'
}
</script>

<template>
  <div class="profile-selector" role="region" :aria-label="t('profile.selectProfile')">
    <h2>{{ t('profile.whoIsPlaying') }}</h2>
    <ul class="profile-list" role="list">
      <li v-for="p in profiles" :key="p.id">
        <button
          type="button"
          class="profile-btn"
          :class="{ active: p.id === activeProfileId }"
          :aria-label="t('profile.selectName', { name: p.name })"
          :aria-pressed="p.id === activeProfileId"
          @click="onSelect(p.id)"
        >
          <span class="profile-thumb" aria-hidden="true">
            <MaatjeAvatar
              :character="maatjeForProfile(p)"
              expression="blij"
              size="sm"
            />
          </span>
          <span class="name">{{ p.name }}</span>
        </button>
      </li>
      <li v-if="!showCreate">
        <button
          type="button"
          class="profile-btn add"
          :aria-label="t('profile.addProfile')"
          @click="showCreate = true"
        >
          {{ t('profile.addButton') }}
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
.profile-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>
