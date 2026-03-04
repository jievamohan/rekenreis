# Epic 15 — Release Prep: Backlog

## scope_in

- **UX pass**
  - Tap target sizing audit: ensure all interactive elements meet 44×44px minimum (WCAG 2.5.5)
  - Color/contrast audit: verify 4.5:1 (normal) / 3:1 (large) where applicable
  - Reduced motion: honor `prefers-reduced-motion` for all animations
- **Copy pass**
  - Friendly microcopy across index, play, stickers, summary, settings
  - Parent-facing and kid-facing wording improvements
- **Bug bash**
  - Test checklist doc (manual verification steps)
  - Quick scripts to start stack and open key URLs
- **Performance**
  - Verify bundle size within baseline
  - Document budget; optimize if over

## scope_out

- New game modes or skins
- Full WCAG audit (beyond tap/contrast/reduced-motion)
- Automated E2E expansion
- Major refactors

## Risks

| Area | Risk | Mitigation |
|------|------|------------|
| UX | Tap target changes may alter layout | Use min-height/min-width, padding; test on small viewport |
| Copy | Subjective tone | Align with kid-friendly, parent-friendly voice; keep changes small |
| Perf | Optimization could regress | Measure before/after; keep budget documented |

## Task List (max 5)

| ID | Title | Lane | Description |
|----|-------|------|-------------|
| 0080 | ux-tap-targets | W1 | Audit and fix tap target sizing (44×44px) across play, stickers, summary, settings, components |
| 0081 | ux-contrast-reduced-motion | W1 | Color/contrast audit + add `prefers-reduced-motion` where animations exist |
| 0082 | copy-pass | W1 | Friendly microcopy pass across pages and key components |
| 0083 | bug-bash-checklist | T, I | Test checklist doc + quick scripts (start stack, open URLs) |
| 0084 | perf-budget-verify | I | Verify bundle budget, document baseline, optimize if over |

## Wave Plan

- **Wave 0**: No shared contracts needed
- **Wave 1**: 0080, 0081, 0082 (W1) in parallel
- **Wave 2**: 0083 (T/I), 0084 (I) in parallel
