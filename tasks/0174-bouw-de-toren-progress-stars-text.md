---
id: 0174-bouw-de-toren-progress-stars-text
title: Bouw-de-toren: round progress bar, remove text, stars only in results
status: done
scope_in:
  - MinigameBouwDeToren.vue: round progress bar, remove progress text, stars only in roundComplete/levelComplete
scope_out:
  - TowerPuzzle.vue
  - play.vue
lanes:
  - W1
file_globs:
  - apps/web/components/minigames/MinigameBouwDeToren.vue
gates:
  - C: typecheck clean
  - D: security baseline
  - F: build passes
risks: []
acceptance:
  - Round progress bar zichtbaar tijdens playing (visueel, role=progressbar, aria)
  - Geen "Ronde X van Y, toren A van B" tekst
  - Sterren niet zichtbaar tijdens playing; wel bij roundComplete en levelComplete
  - Typecheck, build green
---

# Bouw-de-toren: Progress bar, remove text, stars only in results

## Requirements

- Voeg round progress bar toe (zelfde patroon als play.vue: round-progress, round-progress-fill)
- Gebruik currentRoundIndex, totalRounds van useTowerLevelEngine
- Verwijder de div met progressText ("Ronde X van Y, toren A van B")
- Verwijder progress-stars uit tower-scene (playing); behoud in roundComplete en levelComplete

## Acceptance

- Progress bar toont ronde progress
- Geen progress-tekst tijdens playing
- Sterren alleen bij resultaten
- Typecheck, build green
