# Solution Design — Epic 30: Avatars & Expressions

## Solution Designer Output

### Copy Script
- Script: `scripts/copy-maatjes.sh` of npm script
- Kopieer temp_assets/maatjes/* naar apps/web/assets/graphics/characters/maatjes/
- Hernoem mappen: "een-oog eerlijk" → "een-oog-eerlijk", "slimme rekenaar" → "slimme-rekenaar"
- Exclude .DS_Store

### Matrix Definition
- File: `apps/web/content/maatje-matrix.ts` of `.json`
- Structure:
```ts
export const MAATJE_MATRIX: Record<MaatjeId, Record<ExpressionId, string>> = {
  wolkje: { blij: '...', neutraal: '...', verdrietig: '...', nadenken: '...' },
  'een-oog-eerlijk': { blij: '...', feest: '...', ... },
  'slimme-rekenaar': { blij: '...', feest: '...', ... },
}
```
- Fallback chain: requested expression → blij → neutraal → first available

### MaatjeAvatar.vue
- Props: character (MaatjeId), expression (ExpressionId), size? ('sm'|'md'|'lg')
- Resolve asset via useMaatje; render img with alt
- Sizes: sm 40px, md 64px, lg 80px

### ProfileSchema Extension (Optional, Later)
- AvatarId kan uitgebreid worden met maatje-ids, of aparte maatjeId field
- Migratie: bestaande emoji-avatars blijven; nieuwe maatje-keuze optioneel

### Config Constraints
- Geen env vars voor avatars
- Assets in repo (geen CDN)
