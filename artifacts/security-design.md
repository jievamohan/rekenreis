# Epic 2: Skin System + 1 Skin — Security Design

## Scope

- Frontend-only: skin components, composable, types
- No new API, auth, or data handling
- No user input beyond existing (answer selection)

## Threats

- **XSS**: Skin components render game data (numbers); no raw HTML. Vue escaping suffices.
- **Injection**: Skin id from query param; validate against allowlist before use. Unknown → classic.

## Mitigations

- Skin id allowlist in useSkin; never pass unknown id to component resolution
- No eval or dangerouslySetInnerHTML
- No new network calls or storage
