import { ref, computed, readonly } from 'vue'

export interface MistakeItem {
  a: number
  b: number
  correctAnswer: number
  selectedAnswer: number
}

const mistakes = ref<MistakeItem[]>([])

export function useMistakes() {
  function record(item: MistakeItem) {
    mistakes.value = [...mistakes.value, item]
  }

  function clear() {
    mistakes.value = []
  }

  const count = computed(() => mistakes.value.length)

  const hasMistakes = computed(() => mistakes.value.length > 0)

  return {
    mistakes: readonly(mistakes),
    count,
    hasMistakes,
    record,
    clear,
  }
}
