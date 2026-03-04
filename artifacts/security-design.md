# Epic 0: Game Core MVP — Security Design

## Trust boundaries + data flow risks

- **Boundary**: Browser only. No server-side game logic.
- **Data flow**: User input (answer selection) → local state → UI feedback.
- **Risk**: Low—no auth, no persistence, no PII, no payment.

## Threat model light

- **Assets**: None (no stored data, no credentials).
- **Attackers**: N/A for MVP.
- **Entry points**: /play page; same origin as rest of web app.

## Auth/permissions implications

- None. No auth required; game is anonymous, client-only.

## Privacy considerations

- No PII; no logging of answers or scores to server.
- Client state only; cleared on page leave.

## Secure defaults + no-go patterns

- No eval, no dynamic code execution.
- No storage of user data.
- Generator is pure; no injection surface.

## Risk tags + mitigations

- **security**: None.
- **auth**: None.
- **privacy**: None.
