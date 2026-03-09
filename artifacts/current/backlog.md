# Backlog — Epic 30.1: Asset Pipeline + Matrix + MaatjeAvatar

## Scope

**Scope in:**
- Copy maatjes assets to apps/web/assets/graphics/characters/maatjes/ (or create placeholders if temp_assets missing)
- Create types/maatje.ts (MaatjeId, ExpressionId)
- Create maatje-matrix (content/maatje-matrix.ts)
- Create useMaatje composable
- Create MaatjeAvatar.vue component
- Unit tests for useMaatje and MaatjeAvatar

**Scope out:**
- Epic 30.2–30.5 (Map integration, LevelComplete, etc.)
- Profile maatje selection

## Tasks (slice 30.1)

1. **0143-epic30-1-copy-assets** — Copy script + assets (or placeholders)
2. **0144-epic30-1-types-matrix-composable** — types/maatje.ts + maatje-matrix + useMaatje
3. **0145-epic30-1-maatje-avatar** — MaatjeAvatar.vue component
4. **0146-epic30-1-unit-tests** — Unit tests for useMaatje, MaatjeAvatar

## Risks

- temp_assets/maatjes may not exist: create placeholder PNGs so pipeline works
- No auth/db/security impact
