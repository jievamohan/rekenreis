---
id: "0119"
title: "Replace English strings in all pages"
epic: "21.1"
lane: W1
gates: [C, D, F]
risk_tags: []
depends_on: ["0118"]
scope_in:
  - apps/web/pages/index.vue
  - apps/web/pages/start.vue
  - apps/web/pages/map.vue
  - apps/web/pages/play.vue
  - apps/web/pages/summary.vue
  - apps/web/pages/stickers.vue
  - apps/web/pages/settings.vue
scope_out:
  - components (separate task)
  - composables logic changes
acceptance:
  - All 7 pages use t() from useI18n for all visible text
  - All aria-labels use t() for Dutch text
  - No hardcoded English strings remain in page templates
  - MODE_OPTIONS labels in play.vue use t()
  - Mode labels in summary.vue use t()
  - Typecheck clean
  - Build passes
---

# 0119 — Replace English strings in all pages

## What
Replace all hardcoded English strings in all 7 page files with useI18n t() calls.

## Files to modify

### pages/index.vue
- "Welcome!" → t('index.welcome')
- "Ready to practice math?..." → t('index.intro')
- "Check connection" → t('index.checkConnection')
- "Play math game" → t('index.playGame')

### pages/start.vue
- "Start" → t('start.title')
- "Unable to connect..." → t('start.error')
- "Loading..." → t('start.loading')

### pages/map.vue
- "Choose Level" → t('map.title')
- "Overall progress" → t('map.overallProgress')
- "Play current level" → t('map.playCurrentLevel')
- "Play Level {{ currentLevel }}" → t('map.playLevel', { n: currentLevel })
- "Level map" → t('map.levelMap')
- "Player" fallback → t('common.player')

### pages/play.vue
- "Skip to game" → t('play.skipToGame')
- "Exit to Map" / "← Map" → t('common.backToMap')
- "Score" → t('play.score')
- "Round progress" → t('play.roundProgress')
- "Streak" → t('play.streak')
- "Correct!" / "Not quite..." → t('play.correct') / t('play.wrong', { answer })
- "Finish" / "Next" → t('common.finish') / t('common.next')
- MODE_OPTIONS labels → t('modes.classic'), t('modes.timedPop'), t('modes.buildBridge')
- Skin labels → t('skins.classic'), etc.
- "Rounds today" → t('play.roundsToday')
- Privacy note → t('privacy.statsNote')
- "Don't share..." → t('privacy.optOut')

### pages/summary.vue
- "Progress Summary" → t('summary.title')
- All metric labels
- Export button labels
- Privacy note

### pages/stickers.vue
- "Sticker Book" → t('stickers.title')
- Intro text, "New!" badge, unlock labels

### pages/settings.vue
- "Settings" → t('settings.title')
- All setting labels

## Acceptance
- [ ] No English strings in any page template
- [ ] All text uses t() calls
- [ ] Typecheck clean
- [ ] Build passes
