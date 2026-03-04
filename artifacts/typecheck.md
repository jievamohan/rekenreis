# Gate C: Type-safety

## Web

**Status**: PASS

```
cd apps/web && pnpm run typecheck
```

- Nuxt typecheck (vue-tsc) completed with no errors.

## API

**Status**: PASS

```
cd apps/api && composer run phpstan
```

- PHPStan completed with no errors.
