# Architecture — Epic 30: Avatars & Expressions

## Principal Architect Output

### Asset Pipeline
- **Input:** temp_assets/maatjes/{character}/{expression}.png
- **Output:** apps/web/assets/graphics/characters/maatjes/{character}/{expression}.png
- **Naming:** Normaliseer "een-oog eerlijk" → "een-oog-eerlijk" (kebab-case, geen spaties)
- **Matrix:** TypeScript/JSON config: MaatjeId × ExpressionId → import path of URL

### Data Model
- **MaatjeId:** 'wolkje' | 'een-oog-eerlijk' | 'slimme-rekenaar'
- **ExpressionId:** 'blij' | 'neutraal' | 'verdrietig' | 'nadenken' | 'feest' | 'verrast'
- **Avatar matrix:** Record<MaatjeId, Partial<Record<ExpressionId, string>>> (asset paths)
- **Fallback:** Als expressie ontbreekt voor maatje → 'blij' of 'neutraal'

### Component Structure
```
apps/web/
  assets/graphics/characters/maatjes/
    wolkje/
    een-oog-eerlijk/
    slimme-rekenaar/
  components/
    characters/
      MaatjeAvatar.vue    # character + expression → img
  composables/
    useMaatje.ts         # matrix, resolve(character, expression), fallback
  types/
    maatje.ts            # MaatjeId, ExpressionId
```

### Integration Points
- MapAvatar: use profile.avatarId → map to MaatjeId; expression = 'blij'
- LevelCompleteModal: expression from stars (0→verdrietig, 1→neutraal, 2→blij, 3→feest)
- MistakesReview: expression = 'nadenken'
- ProfileSchema: AvatarId blijft; optioneel MaatjeId koppelen (later)

### Performance
- Lazy-load avatar images per context (niet alle 14 in initial bundle)
- Use dynamic import or static path; Nuxt/Vite handles chunking
