---
id: 0167
epic: 36.3
title: Result modal audit + bubble-pop flakiness fix
scope_in:
  - apps/web/e2e/minigame-result-modal.spec.ts
  - artifacts/current/result-modal-audit.md
scope_out:
  - memory-match tests (deferred)
lanes: [T]
gates: [C, D, F]
risk_tags: []
acceptance:
  - result-modal-audit.md with findings
  - bubble-pop 80% flakiness fixed (wait for minigame readiness)
  - All result modal tests pass
  - Typecheck, build green
---

# Task 0167 — Epic 36.3 Result Modal Audit + Fixes

## Requirements
- Run tests; log in result-modal-audit.md
- Fix bubble-pop "No matching bubble found" flake (wait for DOM readiness)
- play.vue / LevelCompleteModal data flow verified correct
