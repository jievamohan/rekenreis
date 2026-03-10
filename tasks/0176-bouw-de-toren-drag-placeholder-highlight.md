---
id: 0176-bouw-de-toren-drag-placeholder-highlight
title: Bouw-de-toren: placeholder on drag + drop area highlight
status: done
scope_in:
  - TowerPuzzle.vue: placeholder bij drag (blokken niet verspringen), highlight drop zone als valide
scope_out:
  - MinigameBouwDeToren.vue
lanes:
  - W1
file_globs:
  - apps/web/components/minigames/bouw-de-toren/TowerPuzzle.vue
gates:
  - C: typecheck clean
  - D: security baseline
  - F: build passes
risks: []
acceptance:
  - Bij slepen blijft lege placeholder op originele positie; blokken verspringen niet
  - Drop zone krijgt highlight wanneer blok erboven gehouden wordt en zone leeg/valide is
  - Typecheck, build green
---

# Bouw-de-toren: Placeholder on drag + drop area highlight

## Requirements

- Tijdens drag: toon placeholder op originele blok-positie (zelfde formaat, leeg/dashed)
- Andere blokken behouden positie
- Hit-test tijdens pointermove: bepaal welke zone (1 of 2) onder cursor valt
- Als zone leeg en valide: geef dropzone class dropzone-highlight / dropzone-valid
- Styling: sterkere border, primary kleur

## Acceptance

- Placeholder zichtbaar tijdens drag
- Geen verschuiving van blokken
- Drop zone highlight bij valid drop
- Typecheck, build green
