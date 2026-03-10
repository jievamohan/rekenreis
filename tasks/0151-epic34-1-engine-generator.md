---
id: 0151-epic34-1-engine-generator
title: Epic 34.1 — useTowerLevelEngine + towerLevelGenerator + types
status: done
scope_in:
  - useTowerLevelEngine.ts: rondes, torens per ronde, fout-telling (2→hint, 3→laatste kans, 4→ronde-skip), sterrenberekening
  - towerLevelGenerator.ts: seeded RNG; genereer per toren { target, blocks } met garantie min. 1 geldige oplossing
  - Types TowerConfig, TowerPuzzle, LevelConfig in apps/web/types/
  - Unit tests voor engine en generator
scope_out:
  - Minigame UI, play.vue integration, assets
lanes:
  - W2: apps/web/composables/*.ts, apps/web/utils/*.ts, apps/web/types/*.ts
  - T: apps/web/test/*.ts
gates:
  - C: typecheck clean
  - D: security baseline
  - F: build passes
risks: []
acceptance:
  - Engine: rondes/torens/fouten correct; 2→hint, 3→laatste kans, 4→ronde-skip
  - Sterrenberekening configureerbaar
  - Generator: seed-deterministisch; elke toren heeft min. 1 geldige oplossing (a+b=target in blocks)
  - Unit tests green; typecheck, build green
---

# Epic 34.1 — Domain Engine + Level Generator

## Requirements

- useTowerLevelEngine.ts: rondes, torens per ronde, fout-telling (2→hint, 3→laatste kans, 4→ronde-skip), sterrenberekening
- towerLevelGenerator.ts: seeded RNG; genereer per toren { target, blocks } met garantie min. 1 geldige oplossing
- Types voor TowerConfig, TowerPuzzle, LevelConfig
- Unit tests: engine (rondes/fouten/sterren); generator (oplossing aanwezig, seed-deterministisch)

## Acceptance

- Engine en generator werken correct
- Unit tests green
- Typecheck, build green
