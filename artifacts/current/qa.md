# Epic 18 — QA Strategy

## Test Requirements

1. **E2E smoke**: Layout loads; play still works
   - Visit /play, /stickers, /summary, /settings, /start
   - Play a round (classic or build-bridge)
   - Verify no regressions

2. **UI regression**: AppShell renders nav tabs and stage
   - Assert nav tabs visible (Sticker book, Progress, Settings)
   - Assert stage/card wrapper present
   - Can be manual smoke step or automated if Playwright exists

3. **Unit tests** (if applicable):
   - AppShell, NavTabs render without error
   - Token CSS variables applied

## Gates

- Gate C: typecheck clean
- Gate D: security baseline (no new secrets, semgrep clean)
- Gate F: build succeeds, bundle budget

## Manual Verification

- No page has plain white background
- Tap targets ≥ 44×44px
- Typography consistent
- Contrast and reduced-motion preserved
