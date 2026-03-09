<script setup lang="ts">
import type { AvatarId } from '~/utils/profileSchema'
import { useI18n } from '~/composables/useI18n'
import { useMaatje } from '~/composables/useMaatje'
import MaatjeAvatar from '~/components/characters/MaatjeAvatar.vue'
import { computed } from 'vue'

const { t } = useI18n()
const { resolve } = useMaatje()

defineProps<{
  avatarId: AvatarId
  name: string
}>()

const avatarEmoji: Record<AvatarId, string> = {
  default: '🐠',
  star: '⭐',
  heart: '💙',
  circle: '🐙',
  square: '🐢',
}

const maatjeSrc = computed(() => resolve('wolkje', 'blij'))
const showMaatje = computed(() => !!maatjeSrc.value)
</script>

<template>
  <div class="map-avatar" :aria-label="t('mapAvatar.position', { name })">
    <div v-if="showMaatje" class="avatar-bubble">
      <MaatjeAvatar character="wolkje" expression="blij" size="sm" />
    </div>
    <span v-else class="avatar-bubble" aria-hidden="true">{{ avatarEmoji[avatarId] ?? '🐠' }}</span>
  </div>
</template>

<style scoped>
.map-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.avatar-bubble {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--app-surface-elevated);
  border: 2px solid var(--app-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: var(--app-shadow-md);
}

@media (prefers-reduced-motion: no-preference) {
  .avatar-bubble {
    animation: avatar-bounce 0.4s ease-out;
  }
}

@keyframes avatar-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
