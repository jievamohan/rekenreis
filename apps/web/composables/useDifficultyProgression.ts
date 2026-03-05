import type { MathRange, DifficultyProgression, ChapterDifficulty } from '~/types/difficulty'
import type { MinigameId } from '~/types/minigame'

const DEFAULT_PROGRESSION: DifficultyProgression = {
  chapters: [
    { chapterMin: 1, chapterMax: 3, mathRange: { operandMin: 0, operandMax: 5, choiceCount: 3 } },
    { chapterMin: 4, chapterMax: 6, mathRange: { operandMin: 0, operandMax: 10, choiceCount: 3 } },
    { chapterMin: 7, chapterMax: 9, mathRange: { operandMin: 0, operandMax: 15, choiceCount: 4 } },
    { chapterMin: 10, chapterMax: 999, mathRange: { operandMin: 0, operandMax: 20, choiceCount: 4 } },
  ],
  minigameParams: {
    'bubble-pop': {
      bubbleCount: { min: 3, max: 6 },
      floatSpeed: { min: 2, max: 4 },
    },
    'treasure-dive': {
      gemCount: { min: 3, max: 5 },
    },
    'fish-feed': {
      timerSeconds: { min: 15, max: 8 },
      pelletCount: { min: 3, max: 5 },
    },
    'coral-builder': {
      pieceCount: { min: 3, max: 5 },
    },
    'submarine-sort': {
      compartmentCount: { min: 2, max: 3 },
      itemCount: { min: 3, max: 5 },
    },
    'starfish-match': {
      pairCount: { min: 2, max: 4 },
      timerSeconds: { min: 20, max: 10 },
    },
  },
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function chapterFromLevel(level: number): number {
  return Math.ceil(level / 3)
}

function findChapterDifficulty(chapter: number, chapters: ChapterDifficulty[]): MathRange {
  for (const ch of chapters) {
    if (chapter >= ch.chapterMin && chapter <= ch.chapterMax) {
      return ch.mathRange
    }
  }
  return chapters[chapters.length - 1].mathRange
}

export function useDifficultyProgression(progression?: DifficultyProgression) {
  const config = progression ?? DEFAULT_PROGRESSION

  function getMathRange(level: number, difficultyCeiling?: number): MathRange {
    const chapter = chapterFromLevel(level)
    const range = findChapterDifficulty(chapter, config.chapters)

    if (difficultyCeiling !== undefined && range.operandMax > difficultyCeiling) {
      return {
        ...range,
        operandMax: difficultyCeiling,
      }
    }

    return range
  }

  function getMinigameParams(
    minigameId: MinigameId,
    level: number,
    totalLevels = 30
  ): Record<string, number> {
    const params = config.minigameParams[minigameId]
    if (!params) return {}

    const t = Math.min(1, Math.max(0, (level - 1) / Math.max(1, totalLevels - 1)))
    const result: Record<string, number> = {}
    for (const [key, range] of Object.entries(params)) {
      result[key] = Math.round(lerp(range.min, range.max, t))
    }
    return result
  }

  return { getMathRange, getMinigameParams, chapterFromLevel }
}

export { chapterFromLevel }
