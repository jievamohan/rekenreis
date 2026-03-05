---
id: "0115"
title: "Wire complete Map→Play→Feedback→Map end-to-end flow"
lane: W1
depends_on: ["0114"]
scope_in:
  - apps/web/pages/map.vue
  - apps/web/pages/play.vue
  - apps/web/components/modals/LevelCompleteModal.vue
scope_out:
  - composables
  - layouts
  - tests
gates: [C, D, F]
risk_tags: []
---

## Objective
Ensure the complete Map→Level→Game→Feedback→Map cycle works end-to-end.
After level completion, "Back to Map" is primary CTA. Map reflects updated progress on return.

## Acceptance Criteria
- [ ] From /map, clicking unlocked level navigates to /play?level=N
- [ ] After 5 rounds, LevelCompleteModal shows with "Back to Map" as primary
- [ ] Clicking "Back to Map" returns to /map
- [ ] Map shows updated stars for completed level
- [ ] "Next Level" secondary CTA advances to next level (if not last)
- [ ] No orphan state: every screen has a way back to /map
- [ ] Typecheck passes
