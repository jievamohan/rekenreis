<script setup lang="ts">
const GATE_STORAGE_KEY = 'rekenreis_parent_gate'
const GATE_TTL_MS = 5 * 60 * 1000

const emit = defineEmits<{
  unlocked: []
}>()

const mode = ref<'choose' | 'hold' | 'math'>('choose')
const holdProgress = ref(0)
const mathA = ref(3)
const mathB = ref(4)
const mathAnswer = ref('')
const mathError = ref(false)

let holdTimer: ReturnType<typeof setInterval> | null = null

function checkStoredUnlock(): boolean {
  if (typeof window === 'undefined') return false
  const raw = sessionStorage.getItem(GATE_STORAGE_KEY)
  if (!raw) return false
  const ts = Number(raw)
  if (!Number.isFinite(ts) || Date.now() - ts > GATE_TTL_MS) return false
  return true
}

function storeUnlock() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GATE_STORAGE_KEY, String(Date.now()))
  }
  emit('unlocked')
}

onMounted(() => {
  if (checkStoredUnlock()) {
    emit('unlocked')
  }
})

function startHold() {
  mode.value = 'hold'
  holdProgress.value = 0
  const start = Date.now()
  const duration = 3000
  holdTimer = setInterval(() => {
    const elapsed = Date.now() - start
    holdProgress.value = Math.min(100, (elapsed / duration) * 100)
    if (holdProgress.value >= 100) {
      if (holdTimer) clearInterval(holdTimer)
      holdTimer = null
      storeUnlock()
    }
  }, 50)
}

function startMath() {
  mode.value = 'math'
  mathA.value = 2 + Math.floor(Math.random() * 5)
  mathB.value = 2 + Math.floor(Math.random() * 5)
  mathAnswer.value = ''
  mathError.value = false
}

function submitMath() {
  const expected = mathA.value + mathB.value
  const given = Number(mathAnswer.value)
  if (given === expected) {
    storeUnlock()
  } else {
    mathError.value = true
  }
}

onUnmounted(() => {
  if (holdTimer) clearInterval(holdTimer)
})
</script>

<template>
  <div class="parent-gate" role="region" aria-label="Parent verification">
    <p class="prompt">For grown-ups: verify to access settings.</p>
    <template v-if="mode === 'choose'">
      <div class="options">
        <button
          type="button"
          class="gate-btn"
          aria-label="Hold for 3 seconds"
          @click="startHold"
        >
          Hold 3 seconds
        </button>
        <button
          type="button"
          class="gate-btn"
          aria-label="Solve a simple sum"
          @click="startMath"
        >
          Solve a simple sum
        </button>
      </div>
    </template>
    <template v-else-if="mode === 'hold'">
      <div class="hold-area">
        <div class="hold-bar">
          <div class="hold-fill" :style="{ width: `${holdProgress}%` }" />
        </div>
        <p>Keep holding...</p>
      </div>
    </template>
    <template v-else>
      <div class="math-area">
        <label>
          {{ mathA }} + {{ mathB }} = ?
          <input
            v-model="mathAnswer"
            type="number"
            inputmode="numeric"
            aria-label="Answer"
            @keydown.enter="submitMath"
          />
        </label>
        <p v-if="mathError" class="error">Try again.</p>
        <button type="button" class="gate-btn" @click="submitMath">Check</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.parent-gate {
  padding: 1rem;
  border: 2px solid #999;
  border-radius: 0.5rem;
  background: #f9f9f9;
}
.prompt {
  margin: 0 0 1rem;
}
.options, .hold-area, .math-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.gate-btn {
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  background: #fff;
  border: 2px solid #333;
}
.hold-bar {
  height: 12px;
  background: #ddd;
  border-radius: 6px;
  overflow: hidden;
}
.hold-fill {
  height: 100%;
  background: #06c;
  transition: width 0.05s linear;
}
.math-area input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-left: 0.5rem;
  min-width: 4rem;
}
.error {
  color: #c00;
}
</style>
