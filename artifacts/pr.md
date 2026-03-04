# Epic 9 — Adaptive Assistance (Hints, Anti-Guessing, Confidence Gate)

Add adaptive assistance so kids don't get stuck or spam-guess.

**Requirements:**
- Confidence gate: after 2 wrong answers, reveal hint (dots / number line)
- Hint modes: dots, number-line visuals
- Gentle pacing: if child struggles (3+ wrong), auto-switch to easier tag for a few rounds
- Persist assistance state locally (session-only for Epic 9)
- Tests: deterministic triggers, no infinite loops
- UX: feedback stays positive; no negative scoring

**Non-goals:**
- Full personalization ML
- Parental dashboards

## Tasks

- [ ] 0050-assistance-state
- [ ] 0051-hint-components
- [ ] 0052-play-integration-assistance
- [ ] 0053-pacing-intervention
- [ ] 0054-tests-assistance

## PR Metadata
- Base: main
- Branch: feat/epic9-adaptive-assistance
- PR: #25
- URL: https://github.com/jievamohan/rekenreis/pull/25
