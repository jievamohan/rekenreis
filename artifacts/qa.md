# Epic 2: Skin System + 1 Skin — QA

## Test strategy

### Unit tests
- `useSkin`: given valid id "classic" | "monster-feed", returns correct component
- `useSkin`: given invalid id, returns classic (fallback)
- Skin contract: when onAnswer/onNext called, verify they are invoked with correct args (mock/spy)

### E2E / Smoke
- Existing smoke: /play, /play?mode=pack still work
- Add: /play?skin=monster-feed loads and shows Monster Feed UI; answer flow works

## Gates

- Gate C: typecheck clean
- Gate D: security scan clean
- Gate F: bundle budget pass
