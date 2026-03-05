# Epic 21.3 — Risk

**Source:** docs/design/epic-21.md

## Overall: Low

- Client-side only; no backend, auth, or payment changes
- No new data handling; localStorage unchanged

## Main Risk

**Drag interaction on touch devices** — Touch drag may behave differently than mouse drag. Mitigation: test on touch-capable devices; ensure keyboard fallback (select-from-list) works when drag is problematic.

## Mitigation

- Keyboard fallback for Treasure Dive (Tab + Enter)
- Reduced motion support (instant state change)
- 44px+ tap targets for touch accessibility
