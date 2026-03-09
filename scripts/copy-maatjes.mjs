#!/usr/bin/env node
/**
 * Copy maatjes assets from temp_assets/maatjes to apps/web/public/graphics/characters/maatjes/
 * Normalises folder names. If temp_assets missing, creates placeholder PNGs.
 */
import { mkdir, cp, readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const SRC = join(REPO_ROOT, 'temp_assets', 'maatjes')
const DEST = join(REPO_ROOT, 'apps', 'web', 'public', 'graphics', 'characters', 'maatjes')

const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

const RAW_TO_NORM = {
  'wolkje': 'wolkje',
  'een-oog eerlijk': 'een-oog-eerlijk',
  'slimme rekenaar': 'slimme-rekenaar',
}
const NORM_TO_RAW = Object.fromEntries(Object.entries(RAW_TO_NORM).map(([k, v]) => [v, k]))

async function copyOrPlaceholder(charDir, expr) {
  const srcChar = NORM_TO_RAW[charDir] ?? charDir
  const srcFile = join(SRC, srcChar, `${expr}.png`)
  const srcFileCap = join(SRC, srcChar, `${expr.charAt(0).toUpperCase() + expr.slice(1)}.png`)
  const destDir = join(DEST, charDir)
  const destFile = join(destDir, `${expr}.png`)
  await mkdir(destDir, { recursive: true })
  try {
    const st = await stat(srcFile)
    if (st.isFile()) {
      await cp(srcFile, destFile)
      return
    }
  } catch {
    // try capitalized
  }
  try {
    const st = await stat(srcFileCap)
    if (st.isFile()) {
      await cp(srcFileCap, destFile)
      return
    }
  } catch {
    // fall through to placeholder
  }
  const { writeFile } = await import('node:fs/promises')
  await writeFile(destFile, PLACEHOLDER_PNG)
}

async function main() {
  await mkdir(DEST, { recursive: true })

  try {
    const entries = await readdir(SRC, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const raw = e.name
      const norm = RAW_TO_NORM[raw] ?? raw
      const srcDir = join(SRC, raw)
      const files = await readdir(srcDir)
      for (const f of files) {
        if (!f.endsWith('.png')) continue
        const base = f.slice(0, -4).toLowerCase()
        await copyOrPlaceholder(norm, base)
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  const required = {
    'wolkje': ['blij', 'neutraal', 'verdrietig', 'nadenken'],
    'een-oog-eerlijk': ['blij', 'feest', 'neutraal', 'verrast', 'verdrietig', 'nadenken'],
    'slimme-rekenaar': ['blij', 'feest', 'verdrietig', 'nadenken'],
  }
  for (const [char, exprs] of Object.entries(required)) {
    for (const expr of exprs) {
      await copyOrPlaceholder(char, expr)
    }
  }

  console.log(`Maatjes assets ready in ${DEST}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
