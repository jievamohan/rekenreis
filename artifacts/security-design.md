# Epic 6 — Game Modes Framework: Security

## Scope

- Client-side only: mode switching, timer, routing.
- No auth, no new API, no persistence changes.

## Considerations

- Query params (mode, source) are user-controlled. Resolver whitelists allowed values; unknown → safe default (classic).
- No injection risk: mode/source used only for routing and component selection.
- No sensitive data in URL.

## Conclusion

No security-impacting changes. Low risk.
