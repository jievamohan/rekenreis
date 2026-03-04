# Epic 7 — QA

## Test Strategy

### Unit

- `modeResolver`: 'build-bridge' resolves correctly; unknown falls back to classic
- Mode selector: select mode → localStorage updated; on load, stored mode applied
- ModeBuildBridge: given question with choices, placing correct plank calls onAnswer(correct); wrong calls onAnswer(wrong)
- Deterministic: use fake timers / jsdom events for build-bridge logic

### Integration

- /play?mode=build-bridge renders ModeBuildBridge
- Mode selector opens, selection updates route and localStorage

### E2E

- Smoke: visit /play, open mode selector, select build-bridge, complete one round (place correct answer), verify score increments
- Existing smoke: classic and timed-pop still pass

### Accessibility

- Keyboard: build-bridge playable without mouse (select plank, place via Enter/Space)
- Focus visible; no traps
