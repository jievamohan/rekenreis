# Epic 15 — Release Prep: Discovery

## Summary

Epic 15 prepares the kid-friendly math game for release-quality UX and stability. Scope: UX pass (tap targets, contrast, reduced motion), copy pass (friendly microcopy), bug bash automation (test checklist + scripts), and performance verification.

## App Surface

### Pages
| Route | Purpose |
|-------|---------|
| `/` | Welcome / nav to start and play |
| `/start` | API health check (dev entry) |
| `/play` | Main game: modes (classic, timed-pop, build-bridge), skins, profiles |
| `/stickers` | Sticker book (rewards) |
| `/summary` | Progress summary (parent view, export) |
| `/settings` | Parent gate, difficulty, hints, sound |

### Key Components
- **Play**: `PlayModeSelector`, skin picker, `ProfileSelector`, mode components (`ModeClassic`, `ModeTimedPop`, `ModeBuildBridge`), skin components (`SkinClassic`, `SkinMonsterFeed`, `SkinSpace`, `SkinPirate`)
- **Settings**: `ParentGate`, difficulty select, hints/sound toggles
- **Shared**: `ProfileSelector`, `ProfileCreate`, `HintDots`, `HintNumberLine`

### Tech Stack
- **Web**: Nuxt 3, Vue 3, TypeScript, Vitest
- **API**: Laravel 12, PHP 8.2, PHPUnit
- **Gates**: C (typecheck/phpstan), D (security), F (build + size)

## UX Audit Findings

### Tap Target Sizing
- **WCAG 2.5.5 Target Size (Level AAA)**: 44×44 CSS px minimum for touch targets.
- **Compliant**: `PlayModeSelector` mode-btn (min-height 44px), skin-btn (44×44), `ProfileSelector` profile-btn (48×48), `ProfileCreate` buttons, `ParentGate` gate-btn, settings select (min-height 44px).
- **Needs audit**: `play.vue` `.skin-btn` (padding 0.35rem 0.75rem ≈ 5.6×12px — likely under 44px), `.choose-game-btn` (padding 0.5rem 1rem), `.close-btn`, `.rewards-link`, `.settings-link`. Skin choice buttons use `min-width: 3.5rem` + padding — effective height may be under 44px. Mode radios in `SkinClassic` (Up to 10/20) — no explicit min-height. Build-bridge planks: `min-height: 4rem`, `min-width: 3rem` — height OK, width borderline.

### Color / Contrast
- Primary: `#06c` (blue), `#e6f2ff` (light blue), `#cce5ff` (hover)
- Text: `#333`, `#666`, `#999`
- Feedback: `#0a0` (correct), `#c00` (incorrect)
- No formal contrast audit in repo. Need to verify 4.5:1 for normal text, 3:1 for large text.

### Reduced Motion / Reading
- `SkinClassic.vue` has `@media (prefers-reduced-motion: reduce)` for feedback animations.
- Other skins (`SkinMonsterFeed`, `SkinSpace`, `SkinPirate`), `ModeTimedPop`, `ModeBuildBridge` — reduced-motion not audited.
- "Reduced reading mode" — no explicit toggle; can add `prefers-reduced-motion` where animations exist and optionally honor system font scaling.

## Copy Audit

| Location | Current | Notes |
|----------|---------|-------|
| index | "Welcome", "Start (API health)", "Play — Math game" | Dev-oriented |
| play | "Choose game", "Sticker book", "Progress", "Settings" | OK |
| play | "Opt out of anonymous stats" | Technical |
| stickers | "Collect stickers by playing! Score X so far." | OK |
| summary | "Progress Summary", "A parent-friendly overview..." | OK |
| summary | "Copy summary", "Download JSON" | Functional |
| settings | "For grown-ups: verify to access settings." | OK |
| ParentGate | "Hold 3 seconds", "Solve a simple sum" | OK |
| SkinClassic | "Correct!", "Time's up! The answer was X.", "Not quite. The answer was X." | Friendly |
| SkinClassic | "Up to 10", "Up to 20" | OK |

Opportunities: index welcome copy, summary export labels, privacy note wording, error states.

## Bug Bash / Test Automation

- **Existing**: Smoke steps in `docs/runbooks/commands.md` (11 steps), Vitest unit tests, PHPUnit.
- **Missing**: Structured test checklist for manual bug bash, quick scripts to spin up stack and open key URLs.

## Performance

- **Baseline** (`artifacts/perf.md`): ~2 MB nitro total, client chunk ~170 kB. Build succeeds.
- **CI**: `pnpm run size` reports `.output`; no explicit budget enforcement in CI (no `bundlesize` or similar).
- **Opportunities**: Document baseline, add budget check script if desired; lazy-load audio already noted in epics.

## Non-Goals (Epic 15)

- New modes or skins
- Major feature work

## Dependencies

- No blocking external deps.
- Tasks can run in parallel where lanes don't overlap (W1 vs T vs I).
