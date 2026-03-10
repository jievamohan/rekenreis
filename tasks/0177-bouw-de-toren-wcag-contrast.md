---
id: 0177-bouw-de-toren-wcag-contrast
title: Bouw-de-toren: WCAG contrast for filled dropzone
status: done
scope_in:
  - TowerPuzzle.vue: .dropzone.filled .zone-value contrast (min 4.5:1)
scope_out:
  - Overige componenten
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
  - Gevulde dropzone tekst heeft voldoende contrast (WCAG AA)
  - Geen lichte tekst op lichte achtergrond
  - Typecheck, build green
---

# Bouw-de-toren: WCAG contrast for filled dropzone

## Requirements

- .dropzone.filled .zone-value: donkere tekst op lichte achtergrond (min 4.5:1)
- Of: donkerdere achtergrond met lichte tekst
- Huidige issue: lichte tekst (#e3f2fd-achtige achtergrond) → slecht leesbaar

## Acceptance

- Contrast min 4.5:1 voor zone-value in filled state
- Typecheck, build green
