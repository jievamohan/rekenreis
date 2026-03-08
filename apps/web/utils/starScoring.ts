/**
 * Compute stars (0–3) from correct answer count with configurable thresholds.
 * Default: [3, 6, 9] for 10 rounds → <3 correct = 0, 3–5 = 1, 6–8 = 2, 9–10 = 3.
 */
export function computeStars(
  correctCount: number,
  totalRounds: number,
  thresholds?: [number, number, number]
): 0 | 1 | 2 | 3 {
  const [t1, t2, t3] =
    thresholds ??
    (totalRounds <= 5
      ? ([2, 3, 4] as [number, number, number])
      : ([3, 6, 9] as [number, number, number]))

  if (correctCount < t1) return 0
  if (correctCount < t2) return 1
  if (correctCount < t3) return 2
  return 3
}
