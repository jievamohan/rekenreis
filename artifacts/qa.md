# Epic 9 — Adaptive Assistance: QA

## Acceptance Criteria (summary)

- After 2 wrong on same question: hint (dots or number line) is revealed
- Hint visuals render correctly and are accessible
- Pacing intervention: 3+ wrong in 5 → next 2 rounds use easier levels (pack mode)
- No infinite loops; no hard fail state
- Feedback stays positive
- Typecheck, security scan, bundle budget pass

## Test Plan

| Area | Test Type | Coverage |
|------|-----------|----------|
| useAssistance | Unit | wrongCount increment, hint at 2, reset on next |
| Hint components | Unit | render with a,b, correctAnswer |
| Pacing intervention | Unit | mock pack; verify easier level selection |
| E2E | Smoke | play 1 wrong, 2 wrong, see hint; continue |
| Determinism | Unit | same inputs → same hint state |
