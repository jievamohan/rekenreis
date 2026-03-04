---
id: "0021"
title: "persistence-schema"
owner: "orchestrator"
status: "done"
scope_in:
  - "Define ProgressSchema v1 (version, bestScore)"
  - "Migration: legacy rekenreis_best_score -> v1 schema"
  - "usePersistence composable: load, save, migrate"
  - "Integrate with useRewards (use usePersistence for bestScore)"
scope_out:
  - "API telemetry (task 0022)"
  - "Privacy UI (task 0023)"
acceptance:
  - "Schema v1 defined; migration from legacy works"
  - "useRewards uses usePersistence for bestScore"
  - "Typecheck passes"
lanes:
  - name: "W2"
    files: ["apps/web/composables/**", "apps/web/utils/**"]
gates: ["C", "D", "F"]
risks:
  - area: "privacy"
    note: "localStorage only; no PII"
---

## Context

Epic 4: Versioned persistence with migration.
