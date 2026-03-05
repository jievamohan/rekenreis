<script setup lang="ts">
import type { AvatarId } from '~/utils/profileSchema'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
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
</script>

<template>
  <div class="map-avatar" :aria-label="t('mapAvatar.position', { name })">
    <span class="avatar-bubble" aria-hidden="true">{{ avatarEmoji[avatarId] ?? '🐠' }}</span>
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
