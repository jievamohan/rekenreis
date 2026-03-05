# QA Strategy: Epic 21

## E2E Tests (container-only Playwright)
1. `e2e/app-flow.spec.ts`:
   - Open /map → click unlocked level → completes game → back to map
   - Verify progress reflected on map after completion
2. `e2e/navigation.spec.ts`:
   - Navigate to settings from map, verify "Back to Map" visible
   - Navigate back to map
   - Verify NavTabs present on all pages
   - Verify no orphan pages (every page has way back to /map)

## Manual Verification
- Check UI visibility rules match the matrix in solution.md
- Check all pages have NavTabs
- Check /play has Exit to Map button

## Gate Coverage
- Gate C: typecheck clean
- Gate D: no new deps, no secrets
- Gate F: build passes, bundle within budget
