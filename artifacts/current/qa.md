# QA Strategy — Epic 30: Avatars & Expressions

## QA Strategist Output

### Unit Tests
- useMaatje: resolve(character, expression) returns valid path
- useMaatje: fallback when expression missing (e.g. slimme-rekenaar + verrast → blij)
- MaatjeAvatar: renders img with correct src for given props
- Matrix: all entries point to existing files (or build-time check)

### E2E Smoke
- Map: avatar visible at current node (maatje or emoji fallback)
- Level complete: maatje visible with correct expression for 0/1/2/3 stars
- Mistakes review: maatje visible
- No console errors for missing assets

### Non-Flaky Assertions
- Use data-testid or aria-label for avatar presence
- Avoid pixel-perfect screenshot; check element exists and has src

### Visual Regression
- Screenshot: map with maatje, level complete (3 stars), mistakes review
- Baseline update if layout changes
