#!/usr/bin/env node
/**
 * Generate level pack JSON files. Run: node scripts/generate-levels.mjs [--count=N] [--output=FILE]
 * Default: count=50, output=levels.v1.json
 * Example: node scripts/generate-levels.mjs --count=200 --output=levels.classic.v1.json
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const args = process.argv.slice(2)
const countArg = args.find((a) => a.startsWith('--count='))
const outputArg = args.find((a) => a.startsWith('--output='))
const count = countArg ? parseInt(countArg.split('=')[1], 10) : 50
const outputFile = outputArg ? outputArg.split('=')[1] : 'levels.v1.json'

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PACING_TAGS = ['easy', 'normal', 'challenge']

function generateLevelPack(seed, config = {}) {
  const packCount = config.count ?? 50
  const includePacingTag = config.includePacingTag ?? false
  const rng = mulberry32(seed)
  const levels = []
  const operandMaxOptions = [5, 10, 15, 20]
  const choiceCountOptions = [3, 4]
  const difficultyTags = ['easy', 'medium']

  for (let i = 0; i < packCount; i++) {
    const operandMax =
      operandMaxOptions[Math.floor(rng() * operandMaxOptions.length)]
    const operandMin = Math.floor(rng() * Math.min(3, operandMax))
    const choiceCount =
      choiceCountOptions[Math.floor(rng() * choiceCountOptions.length)]
    const difficultyTag =
      difficultyTags[Math.floor(rng() * difficultyTags.length)]
    const pacingTag = includePacingTag
      ? PACING_TAGS[Math.floor(rng() * PACING_TAGS.length)]
      : undefined

    const level = {
      operator: 'addition',
      operandMin,
      operandMax,
      choiceCount,
      hintMode: 'none',
      difficultyTag,
    }
    if (pacingTag) level.pacingTag = pacingTag
    levels.push(level)
  }
  return levels
}

const includePacingTag = outputFile.includes('classic') || outputFile.includes('timed-pop') || outputFile.includes('build-bridge')
const levels = generateLevelPack(42, { count, includePacingTag })
const contentDir = join(root, 'content')
mkdirSync(contentDir, { recursive: true })
const outPath = join(contentDir, outputFile)
writeFileSync(outPath, JSON.stringify(levels, null, 2))
console.log(`Wrote ${levels.length} levels to ${outPath}`)
