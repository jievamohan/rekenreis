# Epic 22 — Backlog

**Epic:** 22 — Minigame Mechanics Overhaul (creative interaction models + diversity gate)

---

## Work Streams

### WS-1: Contract v2 Foundation
- Extend minigame type system with `interactionType`, `requiredInputs`, `timeSensitivity`, `layoutClass`, and unique knobs.
- Add validation helpers and migration-safe defaults.
- Annotate enabled minigames with v2 metadata.

### WS-2: Mechanics Upgrades (4 distinct interactions)
- Drag/drop minigame overhaul.
- Timed-but-kind minigame overhaul.
- Sorting/categorization minigame overhaul.
- Spatial/sequence minigame overhaul.

### WS-3: Diversity Gate
- Implement rubric and CI check for distribution threshold.
- Implement duplicate guard for `new` minigames (`interactionType + layoutClass`).
- Produce actionable CI error output.

### WS-4: Kid-safe Timing + Accessibility
- Timeout => hint + continue behavior.
- Settings toggle to disable timers.
- Reduced motion compliance and keyboard fallback hardening.

### WS-5: E2E and Hardening
- Add container-only Playwright scenarios for drag/drop, timeout continuation, sorting keyboard fallback.
- Add Dutch copy assertions for new UX states.
- Final gate and regression verification.

---

## Dependencies

- WS-1 precedes WS-2/WS-3.
- WS-2 and WS-3 can partially parallelize after contract stabilization.
- WS-4 overlays WS-2 mechanics.
- WS-5 runs after core mechanics and gate integration.

## Risks

- Interaction diversity may regress if metadata is incomplete.
- Timer safety can regress without explicit tests.
- CI flakiness in E2E if selectors/fixtures are unstable.
