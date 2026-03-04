#!/usr/bin/env node
/**
 * Generate levels.v1.json. Run: node scripts/generate-levels.mjs
 * Must match generateLevelPack(42, {count:50}) from levelGenerator.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateLevelPack(seed, config = {}) {
  const count = config.count ?? 50
  const rng = mulberry32(seed)
  const levels = []
  const operandMaxOptions = [5, 10, 15, 20]
  const choiceCountOptions = [3, 4]
  const difficultyTags = ['easy', 'medium']

  for (let i = 0; i < count; i++) {
    const operandMax =
      operandMaxOptions[Math.floor(rng() * operandMaxOptions.length)]
    const operandMin = Math.floor(rng() * Math.min(3, operandMax))
    const choiceCount =
      choiceCountOptions[Math.floor(rng() * choiceCountOptions.length)]
    const difficultyTag =
      difficultyTags[Math.floor(rng() * difficultyTags.length)]

    levels.push({
      operator: 'addition',
      operandMin,
      operandMax,
      choiceCount,
      hintMode: 'none',
      difficultyTag,
    })
  }
  return levels
}

const levels = generateLevelPack(42, { count: 50 })
const contentDir = join(root, 'content')
mkdirSync(contentDir, { recursive: true })
const outPath = join(contentDir, 'levels.v1.json')
writeFileSync(outPath, JSON.stringify(levels, null, 2))
console.log(`Wrote ${levels.length} levels to ${outPath}`)
