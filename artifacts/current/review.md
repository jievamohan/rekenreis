# Review — Epic 22.5
1. profileSchema.ts: Added timersDisabled to ProfilePrefs + defaults + validation + migration
2. settings.vue: Timer toggle with help text, data-testid="timer-toggle"
3. MinigameRenderer.vue: Pass-through timersDisabled prop
4. MinigameFishFeed.vue: Respects timersDisabled — no countdown when disabled, timer bar hidden
5. play.vue: Reads timersDisabled from active profile prefs
6. nl.json: Dutch strings for disableTimers and help text
7. Test fix: useLevelProgress.test.ts updated for new pref field
