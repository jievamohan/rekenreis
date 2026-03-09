<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Confetti from '~/components/effects/Confetti.vue'
import MascotIcon from '~/components/graphics/MascotIcon.vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  level: number
  stars: number
  hasMistakes: boolean
  isLastLevel: boolean
}>()

const emit = defineEmits<{
  backToMap: []
  next: []
  reviewMistakes: []
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const starVisible = ref<boolean[]>([])
const showConfetti = ref(false)


watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    starVisible.value = []
    showConfetti.value = false
    await nextTick()
    dialogRef.value?.focus()

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        starVisible.value = [...starVisible.value, true]
        if (i === props.stars - 1 && props.stars >= 2) {
          showConfetti.value = true
        }
      }, 300 + i * 150)
    }
  }
})

function handleKeydown(e: KeyboardEvent) {
  if (!props.open) return

  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }

  if (e.key === 'Tab') {
    const focusable = dialogRef.value?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable?.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <Confetti :active="showConfetti" />
        <div
          ref="dialogRef"
          class="modal-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="t('levelComplete.ariaLabel')"
          tabindex="-1"
        >
          <MascotIcon id-prefix="level-complete" class="mascot" :aria-label="t('levelComplete.mascotAlt')" />

          <h2 class="modal-title">{{ t('levelComplete.title', { level }) }}</h2>

          <div class="stars-row" :aria-label="t('levelComplete.starsAria', { stars })">
            <svg
              v-for="i in 3"
              :key="i"
              class="star-svg"
              :class="{
                earned: i <= stars,
                'star-enter': starVisible[i - 1],
              }"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
            </svg>
          </div>

          <p class="modal-message">{{ stars === 3 ? t('levelComplete.perfect') : stars === 2 ? t('levelComplete.great') : stars === 1 ? t('levelComplete.good') : t('levelComplete.tryAgain') }}</p>

          <div class="modal-actions">
            <button type="button" class="cta-primary" @click="emit('backToMap')">
              {{ t('levelComplete.backToMap') }}
            </button>
            <button
              v-if="!isLastLevel"
              type="button"
              class="cta-secondary"
              @click="emit('next')"
            >
              {{ t('levelComplete.nextLevel') }}
            </button>
            <button
              v-if="hasMistakes"
              type="button"
              class="cta-secondary"
              @click="emit('reviewMistakes')"
            >
              {{ t('levelComplete.reviewMistakes') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--app-space-lg);
}

.modal-dialog {
  background: var(--app-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-lg);
  padding: var(--app-space-xl) var(--app-space-lg);
  max-width: 360px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-space-md);
  outline: none;
}

.modal-enter-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.modal-leave-active {
  transition: opacity 0.15s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}

.modal-leave-to {
  opacity: 0;
}

.mascot {
  width: 80px;
  height: 80px;
}

.modal-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  margin: 0;
}

.stars-row {
  display: flex;
  gap: var(--app-space-sm);
}

.star-svg {
  width: 40px;
  height: 40px;
  transition: fill 0.2s ease, stroke 0.2s ease;
  transform: scale(0);
}

.star-svg.earned {
  fill: #FFC107;
  stroke: none;
}

.star-svg:not(.earned) {
  fill: none;
  stroke: var(--app-muted);
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}

@media (prefers-reduced-motion: no-preference) {
  .star-svg.star-enter {
    animation: star-pop 0.35s var(--app-ease-celebrate) forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .star-svg.star-enter {
    transform: scale(1);
  }
}

@keyframes star-pop {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.modal-message {
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  color: var(--app-text-muted-on-surface);
  margin: 0;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-sm);
  width: 100%;
}

.cta-primary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-cta);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  background: var(--app-primary);
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-primary:hover {
  background: var(--app-primary-hover);
}

.cta-primary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.cta-secondary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-primary);
  background: transparent;
  border: 2px solid var(--app-primary);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-secondary:hover {
  background: rgba(0, 188, 212, 0.1);
}

.cta-secondary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
</style>
