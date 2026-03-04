<script setup lang="ts">
/**
 * Scene layout for graphical modes.
 * Provides: background layer, foreground layer, character slot, default content slot.
 */
import bgScene from '~/assets/graphics/backgrounds/bridge-scene.svg'
</script>

<template>
  <div class="scene-layout" role="presentation">
    <div class="scene-background" aria-hidden="true">
      <img
        :src="bgScene"
        alt=""
        class="scene-bg-img"
      >
    </div>
    <div class="scene-foreground" aria-hidden="true">
      <slot name="foreground" />
    </div>
    <div v-if="$slots.character" class="scene-character" aria-hidden="true">
      <slot name="character" />
    </div>
    <div class="scene-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scene-layout {
  position: relative;
  min-width: 280px;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
  border-radius: 0.5rem;
}

.scene-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.scene-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-foreground {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.scene-foreground :slotted(*) {
  pointer-events: auto;
}

.scene-character {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 2;
  width: 48px;
  height: 48px;
}

.scene-content {
  position: relative;
  z-index: 3;
  padding: 1rem;
}
</style>
