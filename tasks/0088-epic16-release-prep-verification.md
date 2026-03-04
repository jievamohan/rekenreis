---
id: "0088"
title: "epic16-release-prep-verification"
owner: "orchestrator"
status: "done"
scope_in:
  - "Verify tap targets 44×44px on play, stickers, summary, settings, mode selector"
  - "Verify contrast 4.5:1/3:1 and prefers-reduced-motion in skins/modes"
  - "Verify friendly microcopy on index, start, play, stickers, summary, settings"
  - "Verify docs/bug-bash-checklist.md and scripts/bug-bash/ exist"
  - "Verify bundle within perf budget; artifacts/perf.md has baseline"
  - "Fix any regressions found"
scope_out:
  - "Full re-implementation"
  - "New features"
acceptance:
  - "All Epic 16 acceptance criteria verified against current codebase"
  - "Gates C, D, F pass"
  - "No regressions; fix any found"
lanes:
  - name: "T"
    files: ["apps/web/**/*.spec.ts", "apps/web/**/*.test.ts"]
  - name: "W1"
    files: ["apps/web/pages/**", "apps/web/components/**"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 16: Release Prep. Epic 15 already implemented all requirements (tasks 0080–0084). This task verifies Epic 16 criteria and fixes any regressions.

## Dependencies

None.
