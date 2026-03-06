# PR — Epic 22.5: Kid-safe Timer Policy + Settings Integration

## Summary
Add global timer-disable setting: when enabled, timed minigames run without countdown pressure. Timer bar is hidden and no timeout occurs.

## Tasks
- [ ] T1: Add timersDisabled to ProfilePrefs + migration
- [ ] T2: Timer toggle in settings page
- [ ] T3: Pass timersDisabled through MinigameRenderer to FishFeed
- [ ] T4: FishFeed respects timersDisabled

## PR Metadata
- Base: main
- Branch: feat/22.5-timer-policy-settings
- PR: #70
- URL: https://github.com/jievamohan/rekenreis/pull/70
