# Epic 1: Level Contract + Content Pack — Solution

## Environment/config

- No new env vars required.
- Mode: query param `?mode=infinite|pack`; default `infinite` for backward compatibility.
- Optional: `nuxt.config` runtime config for default mode if needed.

## Integration points

- **usePlayGame**: Accept `source: 'infinite' | 'pack'` and optional `levelPack?: Level[]`.
- **play.vue**: Read `route.query.mode` or config; pass to usePlayGame.
- **Content**: `import levelsV1 from '~/content/levels.v1.json'` (Nuxt auto-import) or `fetch('/content/levels.v1.json')` at runtime.

## Operational concerns

- Logging: none required for Epic 1.
- Error handling: Invalid pack → fallback to infinite; log to console in dev.

## NFRs checklist

- **Perf**: Gate F; content pack < 10KB.
- **Security**: Gate D; no new surface.
- **Reliability**: Fallback on pack load failure.

## Rollback

- Revert branch; content pack and schema are additive; no DB/API changes.
