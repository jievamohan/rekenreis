# Epic 7 — Security Design

## Scope

- Mode selector: local UI only; no auth
- Build-bridge: client-side drag/drop; no new network calls
- localStorage: stores mode/skin preferences only; no PII

## Risks

- **Low**: localStorage could be manipulated; impact limited to UX (user's own preferences)
- **None**: No new external deps for drag (native HTML5 or VueUse if already present); no auth/crypto changes

## Mitigations

- Validate mode/skin values when reading from localStorage (allowlist)
- No secrets in localStorage
