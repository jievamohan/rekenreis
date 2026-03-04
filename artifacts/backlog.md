# Epic 9 — Adaptive Assistance: Backlog

## Epic Summary

Add adaptive assistance so kids don't get stuck or spam-guess. Confidence gate reveals hints after 2 wrong answers. Gentle pacing intervention switches to easier levels when child struggles. Hint visuals: dots, number line.

## Scope In

- useAssistance composable: wrong-answer count, hint-reveal at 2 wrong
- Hint components: dots, number-line (grouping deferred)
- Wire assistance into play.vue and skin props
- Pacing intervention: 3+ wrong in recent 5 → next 2 rounds easier (pack mode)
- Tests: deterministic triggers, no infinite loops, E2E smoke

## Scope Out

- Choice reduction (defer)
- Per-profile persistence (Epic 10)
- Grouping hint variant (simplify to dots + number-line only)
- Full personalization ML, parental dashboards

## Risks + Mitigations

| Tag | Risk | Mitigation |
|-----|------|------------|
| perf | Hint components add DOM | Keep lightweight; no heavy deps |

## NFRs

- Perf: bundle budget unchanged
- Security: no new surface
- A11y: hints must be keyboard accessible, aria-describedby

## Task List

| # | Title | Lanes | Gates |
|---|-------|-------|-------|
| 0050 | assistance-state | W2 | C, D, F |
| 0051 | hint-components | W1 | C, D, F |
| 0052 | play-integration-assistance | W1, W2 | C, D, F |
| 0053 | pacing-intervention | W2 | C, D, F |
| 0054 | tests-assistance | T | C, D, F |
