# Epic 4 Solution

1. **Persistence schema**: Define ProgressSchema v1; migration from legacy best_score key
2. **usePersistence**: Load/save with version check; migrate v0->v1
3. **API**: SessionStatsController, POST /api/session-stats, store in DB or log
4. **Privacy**: useTelemetry(optOut), privacy note component, opt-out switch
5. **Tests**: Schema migration, versioning unit tests
