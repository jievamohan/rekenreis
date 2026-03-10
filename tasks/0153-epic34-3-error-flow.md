---
id: 0153-epic34-3-error-flow
title: Epic 34.3 — Bouw de Toren: Error Flow + Feedback
scope_in:
  - MinigameBouwDeToren.vue: show hint modal (phase hint), lastChance modal (phase lastChance), dismissPhase
  - TowerPuzzle.vue: wrong = blocks animate back to pool (reduced-motion: instant); correct = positive feedback + sum display (e.g. "3 + 5 = 8")
  - nl.json: hint, laatsteKans, sumCorrect labels for minigameBouwDeToren
scope_out:
  - Epic 34.4, 34.5, 34.6
lanes:
  - W1
  - W2
file_globs:
  - apps/web/components/minigames/MinigameBouwDeToren.vue
  - apps/web/components/minigames/bouw-de-toren/TowerPuzzle.vue
  - apps/web/content/locales/nl.json
gates:
  - C
  - F
risk_tags:
  - perf
acceptance:
  - 2 fouten → hint modal visible; dismiss continues
  - 3 fouten → laatste kans modal; dismiss continues
  - 4 fouten → ronde overgeslagen (engine already does this)
  - Wrong: blocks animate terug naar pool (reduced-motion: instant)
  - Correct: positieve feedback + som-weergave ("3 + 5 = 8")
  - i18n: hint, laatsteKans, sumCorrect keys
  - Typecheck clean, build green
---

# Epic 34.3 — Bouw de Toren: Error Flow + Feedback

## Requirements

- 2 fouten op toren → hint modal/message
- 3 fouten → "laatste kans" melding
- 4 fouten → ronde overgeslagen, niet-correct (engine already implements this)
- Fout: blokken animatie terug naar pool (reduced-motion: instant)
- Correct: positieve feedback + korte som-weergave (bijv. "3 + 5 = 8")
- i18n: hint, laatste-kans, som-labels

## Acceptance

- Flow correct; terugveren; correct-feedback
- Typecheck, build green
