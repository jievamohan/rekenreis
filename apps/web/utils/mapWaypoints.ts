export interface Waypoint {
  x: number
  y: number
}

export const MAP_VIEW_WIDTH = 300
export const MAP_START_Y = 50
export const MAP_SPACING = 90
export const MAP_PATH_WIDTH = 62

/**
 * Seeded PRNG (mulberry32) for deterministic waypoint generation
 * across all platforms and sessions.
 */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generate organic, flowing waypoints (serpentine path).
 *
 * Path flows from left to right and back in smooth waves — no short bumps.
 * One full wave spans ~10 levels. Uses sine for smooth glooiend patroon.
 */
export function generateWaypoints(count: number): Waypoint[] {
  const rng = mulberry32(42)
  const margin = MAP_PATH_WIDTH / 2 + 2
  const minX = margin
  const maxX = MAP_VIEW_WIDTH - margin
  const amplitude = (maxX - minX) / 2
  const centerX = (minX + maxX) / 2

  /** One full left→right→left wave per ~10 levels */
  const levelsPerWave = 10

  const waypoints: Waypoint[] = []

  for (let i = 0; i < count; i++) {
    /** One full sine wave per levelsPerWave levels */
    const phase = (i / levelsPerWave) * Math.PI * 2
    const wave = Math.sin(phase)
    const x = clamp(centerX + wave * amplitude, minX, maxX)

    const yJitter = i > 0 ? (rng() - 0.5) * 6 : 0
    const y = MAP_START_Y + i * MAP_SPACING + yJitter

    waypoints.push({ x: round1(x), y: round1(y) })
  }

  return waypoints
}

/**
 * Convert waypoints to a smooth SVG path `d` attribute using
 * Catmull-Rom → cubic-Bézier interpolation.
 */
export function waypointsToPathD(waypoints: Waypoint[]): string {
  if (waypoints.length === 0) return ''
  if (waypoints.length === 1) return `M ${waypoints[0].x} ${waypoints[0].y}`

  const parts: string[] = [`M ${waypoints[0].x} ${waypoints[0].y}`]
  const tension = 5

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(0, i - 1)]
    const p1 = waypoints[i]
    const p2 = waypoints[i + 1]
    const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)]

    const cp1x = p1.x + (p2.x - p0.x) / tension
    const cp1y = p1.y + (p2.y - p0.y) / tension
    const cp2x = p2.x - (p3.x - p1.x) / tension
    const cp2y = p2.y - (p3.y - p1.y) / tension

    parts.push(
      `C ${round1(cp1x)} ${round1(cp1y)}, ${round1(cp2x)} ${round1(cp2y)}, ${p2.x} ${p2.y}`,
    )
  }

  return parts.join(' ')
}

export function computeMapHeight(waypoints: Waypoint[]): number {
  if (waypoints.length === 0) return 400
  return Math.max(400, waypoints[waypoints.length - 1].y + 60)
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
