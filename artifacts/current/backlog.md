# Backlog — Epic 30: Avatars & Expressions

## Prioritized Task Slices

### Epic 30.1 — Asset Pipeline + Matrix
- Copy temp_assets/maatjes → assets/graphics/characters/maatjes (normaliseer namen)
- Create maatje-matrix.ts (MaatjeId × ExpressionId → path)
- Create types/maatje.ts
- Create useMaatje composable
- Create MaatjeAvatar.vue component
- Unit tests: useMaatje, MaatjeAvatar

### Epic 30.2 — Map + Level Complete Integration
- MapAvatar: use MaatjeAvatar with profile maatje (or default wolkje), expression Blij
- LevelCompleteModal: replace MascotIcon with MaatjeAvatar; expression from stars (0→verdrietig, 1→neutraal, 2→blij, 3→feest)
- Fallback: emoji/MascotIcon if maatje asset missing
- E2E: map avatar visible; level complete maatje visible

### Epic 30.3 — Mistakes Review + Start/Intro
- MistakesReview: replace MascotIcon with MaatjeAvatar (nadenken)
- Start/index: add maatje with Neutraal or Blij (introductie)
- nl.json: any new aria-labels
- E2E: mistakes review maatje; start page maatje

### Epic 30.4 — Profile Maatje Selection (Optional)
- ProfileCreate: add maatje character choice (wolkje, een-oog-eerlijk, slimme-rekenaar)
- ProfileSchema: extend with maatjeId or map avatarId → maatjeId
- ProfileSelector: show maatje thumbnail instead of emoji when maatje selected
- Migration: existing profiles get default maatje (wolkje)

### Epic 30.5 — Polish + Bundle Budget
- Bundle budget verification
- Visual regression baselines
- Reduced motion check
- Final E2E pass
