<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'

const prefersReducedMotion = ref(false)
import Confetti from '~/components/effects/Confetti.vue'
import MascotIcon from '~/components/graphics/MascotIcon.vue'
import MaatjeAvatar from '~/components/characters/MaatjeAvatar.vue'
import { useI18n } from '~/composables/useI18n'
import { useMaatje } from '~/composables/useMaatje'
import type { ExpressionId, MaatjeId } from '~/types/maatje'

const MAATJE_IDS: MaatjeId[] = ['wolkje', 'een-oog-eerlijk', 'slimme-rekenaar']

const { t } = useI18n()
const { resolve } = useMaatje()

const props = withDefaults(
  defineProps<{
    open: boolean
    level: number
    stars: number
    correctCount: number
    roundsTotal: number
    hasMistakes: boolean
    isLastLevel: boolean
    maatjeId?: MaatjeId
    scorePercent?: number
    timeFormatted?: string
    comboMax?: number
    xpGained?: number
  }>(),
  {
    maatjeId: 'wolkje',
    scorePercent: 0,
    timeFormatted: '00:00',
    comboMax: 0,
    xpGained: 0,
  }
)

const starToExpression: Record<number, ExpressionId> = {
  0: 'verdrietig',
  1: 'neutraal',
  2: 'blij',
  3: 'feest',
}

const maatjeExpression = computed<ExpressionId>(
  () => starToExpression[props.stars] ?? 'neutraal'
)

const displayedMaatjeId = ref<MaatjeId>(props.maatjeId)
const maatjeSrc = computed(() => resolve(displayedMaatjeId.value, maatjeExpression.value))
const showMaatje = computed(() => !!maatjeSrc.value)

const emit = defineEmits<{
  backToMap: []
  next: []
  reviewMistakes: []
  retry: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const starVisible = ref<boolean[]>([])
const showConfetti = ref(false)

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    starVisible.value = []
    showConfetti.value = false
    displayedMaatjeId.value = MAATJE_IDS[Math.floor(Math.random() * MAATJE_IDS.length)]!
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

let mq: MediaQueryList | null = null
function onMqChange(e: MediaQueryListEvent) {
  prefersReducedMotion.value = e.matches
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mq.matches
  mq.addEventListener('change', onMqChange)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  mq?.removeEventListener('change', onMqChange)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay">
        <Confetti :active="showConfetti && !prefersReducedMotion" />
        <div
          ref="dialogRef"
          class="modal-dialog modal-dialog-glow"
          role="dialog"
          aria-modal="true"
          :aria-label="t('levelComplete.ariaLabel')"
          tabindex="-1"
          data-testid="level-complete-modal"
        >
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

          <h2 class="modal-title">{{ t('levelComplete.titleMain') }}</h2>
          <p class="modal-subtitle">{{ t('levelComplete.subtitle', { stars }) }}</p>

          <div v-if="showMaatje" class="mascot mascot-modal">
            <MaatjeAvatar
              :character="displayedMaatjeId"
              :expression="maatjeExpression"
              size="modal"
              :aria-label="t('levelComplete.mascotAlt')"
            />
          </div>
          <MascotIcon
            v-else
            id-prefix="level-complete"
            class="mascot mascot-modal"
            :aria-label="t('levelComplete.mascotAlt')"
          />

          <div class="performance-bar">
            {{ stars === 0 ? t('levelComplete.performanceTryAgain', { correct: correctCount, total: roundsTotal }) : t('levelComplete.performance', { correct: correctCount, total: roundsTotal }) }}
          </div>

          <div class="modal-actions">
            <div class="modal-actions-secondary">
              <button
                v-if="hasMistakes"
                type="button"
                class="cta-secondary cta-review"
                @click="emit('reviewMistakes')"
              >
                {{ t('levelComplete.reviewMistakes') }}
              </button>
              <button type="button" class="cta-secondary cta-retry" @click="emit('retry')">
                {{ t('levelComplete.retry') }}
              </button>
              <button
                v-if="!isLastLevel"
                type="button"
                class="cta-secondary"
                @click="emit('backToMap')"
              >
                {{ t('levelComplete.backToMap') }}
              </button>
            </div>
            <button
              v-if="!isLastLevel"
              type="button"
              class="cta-primary"
              @click="emit('next')"
            >
              {{ t('levelComplete.nextLevel') }}
            </button>
            <button v-else type="button" class="cta-primary" @click="emit('backToMap')">
              {{ t('levelComplete.backToMap') }}
            </button>
          </div>

          <div class="modal-footer-stats">
            <span class="stat-item">
              <span class="stat-label">{{ t('levelComplete.scoreLabel') }}</span>
              <span class="stat-value">{{ scorePercent }}%</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">{{ t('levelComplete.timeLabel') }}</span>
              <span class="stat-value">{{ timeFormatted }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">{{ t('levelComplete.comboLabel') }}</span>
              <span class="stat-value stat-combo">x{{ comboMax }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">{{ t('levelComplete.xpLabel') }}</span>
              <span class="stat-value stat-xp">+{{ xpGained }}</span>
            </span>
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
  position: relative;
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
  font-family: var(--app-font);
}

.modal-dialog-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 80px;
  background: radial-gradient(ellipse at center, rgba(129, 199, 132, 0.35) 0%, transparent 70%);
  pointer-events: none;
  border-radius: var(--app-radius-lg);
}

.mascot {
  width: 80px;
  height: 80px;
}

.mascot-modal {
  width: 270px;
  height: 270px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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

.modal-title {
  font-family: var(--app-font);
  font-size: var(--app-font-size-2xl);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  margin: 0;
}

.modal-subtitle {
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  color: var(--app-text-muted-on-surface);
  margin: 0;
}

.performance-bar {
  background: rgba(76, 175, 80, 0.2);
  border-radius: var(--app-radius-md);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  width: 100%;
  text-align: center;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-sm);
  width: 100%;
}

.modal-actions-secondary {
  display: flex;
  gap: var(--app-space-sm);
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-primary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-lg);
  font-family: var(--app-font);
  font-size: var(--app-font-size-cta);
  font-weight: var(--app-font-weight-bold);
  color: white;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-primary:hover {
  background: linear-gradient(135deg, #5cb860 0%, #43a047 100%);
}

.cta-primary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.cta-secondary {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-on-surface);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: background var(--app-transition);
}

.cta-secondary:hover {
  background: rgba(0, 0, 0, 0.05);
}

.cta-review {
  background: rgba(255, 235, 59, 0.4);
  border-color: rgba(255, 193, 7, 0.5);
}

.cta-retry {
  background: rgba(245, 245, 245, 0.9);
}

.cta-secondary:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

/* Stats: supportive info, soft hierarchy — uses app font (modal is teleported to body, outside .app-root) */
.modal-footer-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-space-sm) var(--app-space-md);
  justify-content: center;
  align-items: baseline;
  width: 100%;
  padding-top: var(--app-space-sm);
  margin-top: var(--app-space-xs);
  border-top: 1px solid rgba(0, 77, 64, 0.08);
  font-family: var(--app-font);
}

.stat-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25em;
  background: rgba(0, 77, 64, 0.06);
  padding: 0.25em 0.5em;
  border-radius: var(--app-radius-sm);
}

.stat-label {
  font-family: var(--app-font);
  font-size: 0.875rem;
  font-weight: var(--app-font-weight-normal);
  color: var(--app-text-muted-on-surface);
  text-transform: none;
}

.stat-value {
  font-family: var(--app-font);
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-normal);
  color: var(--app-text-on-surface);
}

.stat-combo {
  color: #a89050;
  font-weight: 600;
}

.stat-xp {
  color: #6b9b6e;
  font-weight: 600;
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
</style>
