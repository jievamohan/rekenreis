# Epic 13 — Share/Print Progress Summary: UX

## Principles

- Parent-friendly: clear, scannable, no jargon
- Local-only: no account, no cloud; data stays on device
- Print-friendly: summary screen suitable for printing or screenshot

## Summary Screen

### Route

- `/summary` — dedicated progress summary page
- Reachable from play nav (e.g. "Progress" link) or settings

### Content

1. **Rounds played**
   - Today: X rounds (reuse daily goal display)
   - Total: Y rounds (all-time, from persisted history)

2. **Accuracy trend (simple)**
   - Overall: Z% correct (correct / (correct + wrong + timeout))
   - Optional: "Last 7 days" or "This week" if we store daily snapshots
   - v1: single overall percentage is sufficient

3. **Favorite mode**
   - Most-played mode: Classic / Timed Pop / Build Bridge
   - Derived from mode usage counts (or fallback to lastMode if no history)

### Layout

- Card/section per metric
- Large, readable typography
- No identifiers (no profile name, no ID in visible UI)
- Optional: "Print" or "Share" actions (copy / download)

## Export Flows

### Copy to clipboard

- Button: "Copy summary"
- Copies plain text or JSON (sanitized, no identifiers)
- Toast/feedback: "Copied to clipboard"

### Download JSON (optional)

- Button: "Download JSON"
- Downloads file: `rekenreis-progress-YYYY-MM-DD.json`
- Contents: rounds, accuracy, favorite mode only; no profile id, no name

### Print

- Use browser print (Ctrl/Cmd+P) on summary page
- Page styled for print: hide nav/buttons if needed; show only summary content

## Non-goals

- Cloud sync
- Analytics dashboards
- Social sharing (e.g. Twitter, WhatsApp) — copy/download is sufficient for parent use
