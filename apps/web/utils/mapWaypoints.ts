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
 * Generate organic, non-repeating waypoints.
 *
 * Uses three summed sine harmonics whose frequencies are related by the
 * golden ratio — this guarantees the pattern never visually repeats within
 * any reasonable level count. Small seeded noise on top keeps it organic.
 */
export function generateWaypoints(count: number): Waypoint[] {
  const rng = mulberry32(42)
  const margin = MAP_PATH_WIDTH / 2 + 2
  const centerX = MAP_VIEW_WIDTH / 2
  const amplitude = centerX - margin

  const phi = (1 + Math.sqrt(5)) / 2
  const baseFreq = 2.8 + rng() * 0.5
  const harmonics = [
    { amp: 0.70, freq: baseFreq, phase: rng() * Math.PI * 2 },
    { amp: 0.22, freq: baseFreq * phi, phase: rng() * Math.PI * 2 },
    { amp: 0.13, freq: baseFreq * phi * phi, phase: rng() * Math.PI * 2 },
  ]

  const waypoints: Waypoint[] = []

  for (let i = 0; i < count; i++) {
    const t = i / Math.max(count - 1, 1)

    let wave = 0
    for (const h of harmonics) {
      wave += h.amp * Math.sin(t * Math.PI * 2 * h.freq + h.phase)
    }
    wave += (rng() - 0.5) * 0.15
    wave = clamp(wave / 1.08, -1, 1)

    const x = clamp(centerX + wave * amplitude, margin, MAP_VIEW_WIDTH - margin)
    const yJitter = i > 0 ? (rng() - 0.5) * 14 : 0
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
