# Epic 0: Game Core MVP — Solution Design

## Environment/config needs

- None. No new env vars; existing `apiUrl` unaffected.
- Game logic is client-only; no new Docker or env wiring.

## Integration points

- None. No API calls for game logic.
- `/play` is a new route; no changes to `/start` or API.

## Operational concerns

- N/A for MVP—client-only, no logging/observability needed for game loop.

## Deployment considerations

- CI: New tests in `lint-test` job; no workflow changes.
- No migrations, no infra changes.

## NFRs checklist

| NFR | Approach |
|-----|----------|
| Perf | Generator is sync; gate F passes. |
| Security | No new surface. |
| Reliability | Deterministic logic; no flaky network. |
| A11y | Keyboard + focus as per ux.md. |

## Rollback approach

- Feature is additive: new route, new utils/composables.
- Removing `/play` and related files reverts the feature; no DB or API rollback needed.
