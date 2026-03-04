#!/usr/bin/env node
/**
 * Generate minimal WAV SFX for Epic 11. Run: node scripts/generate-sfx.mjs
 * Output: public/sfx/correct.wav, wrong.wav, celebrate.wav
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'sfx')

function makeWav(samples) {
  const dataLen = samples.length * 2
  const buf = Buffer.alloc(44 + dataLen)
  let o = 0
  buf.write('RIFF', o); o += 4
  buf.writeUInt32LE(36 + dataLen, o); o += 4
  buf.write('WAVE', o); o += 4
  buf.write('fmt ', o); o += 4
  buf.writeUInt32LE(16, o); o += 4
  buf.writeUInt16LE(1, o); o += 2
  buf.writeUInt16LE(1, o); o += 2
  buf.writeUInt32LE(8000, o); o += 4
  buf.writeUInt32LE(16000, o); o += 4
  buf.writeUInt16LE(2, o); o += 2
  buf.writeUInt16LE(16, o); o += 2
  buf.write('data', o); o += 4
  buf.writeUInt32LE(dataLen, o); o += 4
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, samples[i])), o)
    o += 2
  }
  return buf
}

function beep(freq, len) {
  const samples = []
  const sr = 8000
  const n = Math.floor(sr * len)
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const env = Math.exp(-t * 20)
    samples.push(Math.floor(3000 * env * Math.sin(2 * Math.PI * freq * t)))
  }
  return samples
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'correct.wav'), makeWav(beep(880, 0.08)))
writeFileSync(join(outDir, 'wrong.wav'), makeWav(beep(220, 0.1)))
writeFileSync(join(outDir, 'celebrate.wav'), makeWav(beep(523, 0.12)))
console.log('Generated public/sfx/correct.wav, wrong.wav, celebrate.wav')
