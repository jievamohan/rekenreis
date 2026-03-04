# Epic 8 — Content Packs per Mode + Pacing Rules: UX

## User Impact

- **Invisible to user**: Content pack selection and pacing are internal; no new UI controls.
- **Perceived effect**: Sessions feel more varied; fewer frustrating back-to-back hard rounds.
- **No new screens**: Reuses existing /play and mode selector.

## UX Notes

- Pacing engine runs server-side (in-browser); no loading states needed.
- If a mode has no pack, fallback to infinite (existing behavior) or to a default pack.
- E2E must verify pack mode for all three modes.
