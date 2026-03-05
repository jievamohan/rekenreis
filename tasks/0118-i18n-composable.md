---
id: "0118"
title: "Create useI18n composable + nl.json"
epic: "21.1"
lane: W2
gates: [C, D, F]
risk_tags: []
depends_on: []
scope_in:
  - apps/web/composables/useI18n.ts
  - apps/web/content/locales/nl.json
scope_out:
  - pages
  - components
  - vue-i18n package
acceptance:
  - useI18n composable exports t(key, params?) function
  - t('common.next') returns 'Volgende'
  - t('play.wrong', { answer: 7 }) returns interpolated Dutch string
  - t('nonexistent.key') returns 'nonexistent.key' as fallback
  - nl.json contains all UI string keys (~150+ keys)
  - Typecheck passes
  - Build succeeds
---

# 0118 — Create useI18n composable + nl.json

## What
Create the i18n infrastructure: a composable for Dutch text lookup and the comprehensive nl.json source-of-truth file.

## Implementation

### apps/web/content/locales/nl.json
Comprehensive Dutch UI text covering all pages and components. Structure:
- common: shared strings (next, close, back, map, etc.)
- nav: navigation labels
- index: home page
- start: connection check page
- map: level map page
- play: play screen (score, streak, feedback, etc.)
- levelComplete: level complete modal
- mistakesReview: mistakes review screen
- summary: progress summary page
- stickers: sticker book page
- settings: settings page
- modes: game mode labels
- skins: skin labels
- profile: profile selector/create
- parentGate: parent verification
- privacy: privacy notices
- hints: hint aria-labels
- a11y: general accessibility labels

### apps/web/composables/useI18n.ts
- Import nl.json statically
- Export useI18n() returning { t }
- t(key: string, params?: Record<string, string | number>): string
- Supports dot-notation lookup (e.g. 'play.correct')
- Supports interpolation: {answer} in value replaced by params.answer
- Returns key as fallback if not found (dev visibility)

## Acceptance
- [ ] nl.json exists with all keys
- [ ] useI18n composable works with simple and interpolated keys
- [ ] Fallback returns key string
- [ ] Typecheck clean
- [ ] Build passes
