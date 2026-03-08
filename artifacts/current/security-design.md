# Security & Privacy — Epic 27 (Security/Privacy)

## New Risks Introduced

**None.** This epic replaces one minigame component with a new implementation. No new:
- Auth or permissions
- Data collection or storage
- External API calls
- User input beyond existing answer selection

## Config Constraints

- No new env vars or secrets
- Assets are static SVGs; no user-generated content

## Data Handling

- Same as existing: question + answer flow; no PII
- No new localStorage or cookies

## Checks Required

- Gitleaks: no new secrets
- SAST: no new attack surface
- Dependency: no new packages (reuse existing)

**Impact: none.** Security review: N/A for this scope.
