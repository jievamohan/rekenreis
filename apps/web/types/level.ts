/**
 * Level schema for data-driven math game.
 * Addition only for now; extensible for future operators.
 */
export interface Level {
  /** Operator: "addition" only for Epic 1 */
  operator: 'addition'
  /** Minimum value for each operand (a, b) */
  operandMin: number
  /** Maximum value for each operand (a, b) */
  operandMax: number
  /** Number of multiple-choice options (e.g. 3 or 4) */
  choiceCount: number
  /** Hint display mode (e.g. "none", "show-after", "always") */
  hintMode: string
  /** Difficulty tag for progression (e.g. "easy", "medium") */
  difficultyTag: string
  /** Optional mastery rules for future use */
  masteryRules?: Record<string, unknown>
}
