<script setup lang="ts">
import type { InteractionModeId } from '~/types/mode'
import type { SkinId } from '~/utils/skinResolver'
import { SKIN_ORDER, UNLOCK_THRESHOLDS } from '~/utils/rewardsConfig'

const props = defineProps<{
  modelValue: boolean
  currentMode: InteractionModeId
  currentSkin: SkinId
  isUnlocked: (id: SkinId) => boolean
  modeOptions: { id: InteractionModeId; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [mode: InteractionModeId, skin: SkinId]
}>()

function selectMode(mode: InteractionModeId, skin: SkinId) {
  emit('select', mode, skin)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="mode-selector-overlay"
      role="dialog"
      aria-labelledby="mode-selector-title"
      aria-modal="true"
      @keydown.escape="close"
    >
      <div class="mode-selector-backdrop" aria-hidden="true" @click="close" />
      <div class="mode-selector-panel">
        <h2 id="mode-selector-title" class="mode-selector-title">
          Choose game
        </h2>

        <div class="mode-options" role="group" aria-label="Game mode">
          <button
            v-for="opt in modeOptions"
            :key="opt.id"
            type="button"
            class="mode-btn"
            :class="{ active: currentMode === opt.id }"
            :aria-pressed="currentMode === opt.id"
            :aria-label="`Select ${opt.label} mode`"
            @click="selectMode(opt.id, currentSkin)"
          >
            <span class="mode-icon" aria-hidden="true">
              {{ opt.id === 'classic' ? '👆' : opt.id === 'timed-pop' ? '⏱️' : '🌉' }}
            </span>
            <span class="mode-label">{{ opt.label }}</span>
          </button>
        </div>

        <div class="skin-options" role="group" aria-label="Skin">
          <p class="skin-label">Theme</p>
          <div class="skin-btns">
            <button
              v-for="id in SKIN_ORDER"
              :key="id"
              type="button"
              class="skin-btn"
              :class="{ active: currentSkin === id, locked: !isUnlocked(id) }"
              :disabled="!isUnlocked(id)"
              :aria-label="isUnlocked(id) ? `Select ${id} theme` : `${id} locked`"
              @click="selectMode(currentMode, id)"
            >
              {{ id }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="close-btn"
          aria-label="Close"
          @click="close"
        >
          Close
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mode-selector-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.mode-selector-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.mode-selector-panel {
  position: relative;
  background: var(--app-surface);
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 20rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mode-selector-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  min-height: 44px;
  font-size: 1rem;
  border: 2px solid var(--app-muted);
  border-radius: 0.5rem;
  background: var(--app-surface);
  cursor: pointer;
  text-align: left;
}

.mode-btn:hover {
  background: var(--app-surface-elevated);
}

.mode-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.mode-btn.active {
  border-color: var(--app-primary);
  background: rgba(0, 188, 212, 0.15);
}

.mode-icon {
  font-size: 1.5rem;
}

.mode-label {
  flex: 1;
}

.skin-options {
  margin-bottom: 1rem;
}

.skin-label {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--app-text-muted);
}

.skin-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skin-btn {
  padding: 0.5rem 0.75rem;
  min-height: 44px;
  min-width: 44px;
  font-size: 0.9rem;
  border: 1px solid var(--app-muted);
  border-radius: 0.375rem;
  background: var(--app-surface);
  cursor: pointer;
}

.skin-btn:hover:not(:disabled) {
  background: var(--app-surface-elevated);
}

.skin-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}

.skin-btn.active {
  border-color: var(--app-primary);
  background: rgba(0, 188, 212, 0.15);
}

.skin-btn.locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.close-btn {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--app-muted);
  border-radius: 0.375rem;
  background: var(--app-surface-elevated);
  cursor: pointer;
}

.close-btn:hover {
  background: var(--app-surface);
}

.close-btn:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
</style>
