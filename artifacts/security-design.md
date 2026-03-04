# Epic 11 — Audio & Micro-Animations: Security Design

## Scope

- Sound: local files only (public/sfx); no external URLs
- Animations: CSS/Vue only; no user-controlled input

## Risks

- **Low**: No auth, payments, or sensitive data
- Audio: same-origin assets only

## Mitigations

- Use only bundled/public assets for SFX
- No eval or dynamic script from user input
