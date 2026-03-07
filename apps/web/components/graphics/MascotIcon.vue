<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Unique id prefix for gradients (avoid conflicts when multiple instances) */
    idPrefix?: string
    /** Accessible label; when set, role="img" is used instead of aria-hidden */
    ariaLabel?: string
  }>(),
  { idPrefix: 'mascot', ariaLabel: undefined }
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    fill="none"
    class="mascot-icon"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : true"
  >
    <defs>
      <radialGradient :id="`${idPrefix ?? 'mascot'}BodyGrad`" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#E0F7FA" />
        <stop offset="100%" stop-color="#4DD0E1" stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="65" rx="38" ry="32" fill="#4DD0E1" />
    <ellipse cx="60" cy="65" rx="38" ry="32" :fill="`url(#${idPrefix}BodyGrad)`" opacity="0.4" />
    <ellipse cx="60" cy="72" rx="24" ry="16" fill="#E0F7FA" opacity="0.6" />
    <circle cx="46" cy="58" r="8" fill="#fff" />
    <circle cx="74" cy="58" r="8" fill="#fff" />
    <circle cx="48" cy="57" r="4" fill="#263238" />
    <circle cx="76" cy="57" r="4" fill="#263238" />
    <circle cx="49.5" cy="55.5" r="1.5" fill="#fff" />
    <circle cx="77.5" cy="55.5" r="1.5" fill="#fff" />
    <path d="M48 72 Q60 82 72 72" stroke="#263238" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <circle cx="40" cy="70" r="5" fill="#F48FB1" opacity="0.35" />
    <circle cx="80" cy="70" r="5" fill="#F48FB1" opacity="0.35" />
    <path d="M52 34 Q60 18 68 34" fill="#26C6DA" />
    <path d="M22 60 Q12 52 20 44" stroke="#26C6DA" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M98 60 Q108 52 100 44" stroke="#26C6DA" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M60 97 Q48 110 38 100 Q48 95 60 97Z" fill="#26C6DA" />
    <path d="M60 97 Q72 110 82 100 Q72 95 60 97Z" fill="#26C6DA" />
    <circle cx="92" cy="38" r="3" fill="#B2EBF2" opacity="0.7" />
    <circle cx="100" cy="28" r="2" fill="#B2EBF2" opacity="0.5" />
    <circle cx="96" cy="20" r="1.5" fill="#B2EBF2" opacity="0.4" />
  </svg>
</template>

<style scoped>
.mascot-icon {
  display: block;
}
</style>
