<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const props = defineProps<{
  disabled: boolean
  maxDigits?: number
}>()

const emit = defineEmits<{
  answer: [value: number]
}>()

const input = ref('')
const max = props.maxDigits ?? 2

function pressDigit(d: number) {
  if (props.disabled) return
  if (input.value.length >= max) return
  input.value += String(d)
}

function clear() {
  if (props.disabled) return
  input.value = ''
}

function check() {
  if (props.disabled || input.value === '') return
  emit('answer', Number(input.value))
}

function handleGlobalKey(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault()
    pressDigit(Number(e.key))
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault()
    clear()
  } else if (e.key === 'Enter' && input.value !== '') {
    e.preventDefault()
    check()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey))
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey))

defineExpose({ input, clear: () => { input.value = '' } })
</script>

<template>
  <div class="keypad" role="group" :aria-label="t('keypad.ariaLabel')">
    <div class="keypad-grid">
      <button
        v-for="d in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="d"
        type="button"
        class="key digit"
        :aria-label="String(d)"
        :disabled="disabled"
        @click="pressDigit(d)"
      >
        {{ d }}
      </button>
      <button
        type="button"
        class="key action clear-key"
        :aria-label="t('keypad.clear')"
        :disabled="disabled"
        @click="clear"
      >
        C
      </button>
      <button
        type="button"
        class="key digit"
        aria-label="0"
        :disabled="disabled"
        @click="pressDigit(0)"
      >
        0
      </button>
      <button
        type="button"
        class="key action check-key"
        :class="{ ready: input !== '' }"
        :aria-label="t('keypad.checkAnswer')"
        :disabled="disabled || input === ''"
        @click="check"
      >
        ✓
      </button>
    </div>
  </div>
</template>

<style scoped>
.keypad {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--app-space-sm);
}

.key {
  min-height: var(--app-tap-min);
  min-width: var(--app-tap-min);
  font-family: var(--app-font);
  font-size: var(--app-font-size-keypad);
  font-weight: var(--app-font-weight-bold);
  border: 2px solid transparent;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease-out, background 0.1s ease-out;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.key:active:not(:disabled) {
  transform: scale(0.95);
}

.key:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.key:disabled {
  cursor: default;
  opacity: 0.5;
}

.key.digit {
  background: var(--app-keypad-key);
  color: var(--app-text-on-surface);
  border-color: var(--app-map-path-edge);
  box-shadow: var(--app-shadow-sm);
}

.key.digit:hover:not(:disabled) {
  background: var(--app-surface-elevated);
}

.key.action {
  background: var(--app-surface);
  color: var(--app-text-muted-on-surface);
}

.key.action:hover:not(:disabled) {
  background: var(--app-surface-elevated);
}

.key.check-key.ready {
  background: var(--app-primary);
  color: var(--app-text-on-surface);
  border-color: var(--app-primary);
}

.key.check-key.ready:hover:not(:disabled) {
  background: var(--app-primary-hover);
}
</style>
