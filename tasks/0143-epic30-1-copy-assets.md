---
id: 0143
slug: epic30-1-copy-assets
title: Epic 30.1 — Copy maatjes assets to target location
epic: 30.1
lanes: [I]
scope_in:
  - Copy script for temp_assets/maatjes → apps/web/assets/graphics/characters/maatjes/
  - Normalise folder names (een-oog eerlijk → een-oog-eerlijk, slimme rekenaar → slimme-rekenaar)
  - Create placeholder PNGs if temp_assets missing
scope_out:
  - types, matrix, composable, component
acceptance:
  - 14 PNG assets in assets/graphics/characters/maatjes/ (wolkje, een-oog-eerlijk, slimme-rekenaar)
  - Directory structure matches assets.md spec
  - Copy script runs without error
gates: [C, D, F]
risk_tags: []
---

# Task 0143 — Copy maatjes assets

## Acceptance

- [ ] 14 PNG assets in apps/web/assets/graphics/characters/maatjes/
- [ ] Folders: wolkje/, een-oog-eerlijk/, slimme-rekenaar/
- [ ] Copy script (scripts/copy-maatjes.sh or npm) normalises names
- [ ] If temp_assets/maatjes missing: create minimal placeholder PNGs

## Implementation notes

- Per assets.md: wolkje (4), een-oog-eerlijk (6), slimme-rekenaar (4)
- Placeholder: 1x1 or 40x40 minimal PNG if source absent
