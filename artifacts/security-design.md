# Epic 10 — Child Profiles: Security Design

## Risk Assessment

- **Low**: All data local (localStorage); no auth, no cloud
- **Parent gate**: Not cryptographic; UX obstacle only. Session-scoped unlock.

## Mitigations

- No PII beyond optional profile name (user-entered)
- Parent gate state in sessionStorage (cleared on close)
- No identifiers sent to API (telemetry remains anonymous)
