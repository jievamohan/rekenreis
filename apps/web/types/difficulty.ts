export interface MathRange {
  operandMin: number
  operandMax: number
  choiceCount: number
}

export interface ChapterDifficulty {
  chapterMin: number
  chapterMax: number
  mathRange: MathRange
}

export interface MinigameParamRange {
  min: number
  max: number
}

export interface DifficultyProgression {
  chapters: ChapterDifficulty[]
  minigameParams: Record<string, Record<string, MinigameParamRange>>
}
