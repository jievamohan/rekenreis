# Epic 11 — Audio & Micro-Animations: QA

## Test Cases

1. **Settings persistence**: Toggle sound off → reload → still off
2. **Per-profile**: Profile A sound off, Profile B sound on → switch → correct behavior
3. **Reduced motion**: prefers-reduced-motion: reduce → no feedback animations
4. **Audio fail-safe**: Mock Audio failure → gameplay continues; no errors
5. **Bundle budget**: Build; size within baseline (lazy-load ensures minimal impact)

## Acceptance

- Unit tests: useSound (mocked Audio), profile prefs soundOn
- E2E optional: settings toggle, reduced-motion (browser media query)
