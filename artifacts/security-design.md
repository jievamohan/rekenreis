# Epic 13 — Share/Print Progress Summary: Security Design

## Scope

- Local-only: no new API, no server, no auth
- Export: clipboard and file download; data stays on device unless user explicitly copies/downloads

## Privacy Requirements

1. **No identifiers in export**
   - Export payload MUST NOT include: profile id, profile name, avatar id
   - Allowed: roundsToday, roundsTotal, accuracy, favoriteMode, exportedAt (ISO string)

2. **Local-only by default**
   - All data in localStorage; no network calls for summary/export
   - User-initiated copy/download only

3. **Clipboard API**
   - `navigator.clipboard.writeText()` — requires secure context (HTTPS or localhost)
   - Fallback: not required for v1 if we assume deployed app is HTTPS

## Risks

| Risk | Level | Mitigation |
|------|-------|------------|
| Accidental identifier leak in export | Low | Explicit sanitization; unit test asserts no id/name in payload |
| Clipboard permission | Low | User-initiated; no auto-copy |
| LocalStorage growth | Low | Aggregates only; bounded (no unbounded history) |

## Non-Goals

- Encryption of export
- Audit logging
- Consent flows (local data; no new data collection)
