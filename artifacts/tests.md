# Tests

## Web

**Status**: PASS

```
cd apps/web && pnpm run test
```

- test/example.test.ts: 1 passed
- test/api.test.ts: 2 passed (fetchHealth with mocked fetch)

## API

**Status**: PASS

```
cd apps/api && composer run test
```

- Tests\Feature\HealthTest::test_health_endpoint_returns_ok_and_version: PASS
- All 3 tests passed (4 assertions)
