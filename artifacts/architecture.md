# Epic 10 — Child Profiles: Architecture

## Storage Layout

```
rekenreis_profiles_v1: {
  version: 1,
  activeProfileId: string,
  profiles: [
    { id, name, avatarId, progress: { bestScore }, prefs: { lastMode, lastSkin, difficultyCeiling, hintsOn }, telemetryOptOut }
  ]
}
```

## Migration

- On load: if no profiles data, migrate from legacy single-user:
  - Create profile "default" with id=uuid, name="Player 1", avatarId="default"
  - Migrate rekenreis_progress.bestScore, last_mode, last_skin, telemetry opt-out
  - Write profiles schema; keep legacy keys for one version then deprecate

## Composables

- **useProfile**: loadProfiles, activeProfile, switchProfile(id), createProfile(name, avatarId)
- **usePlayPreferences**: read from activeProfile.prefs; write to active profile
- **usePersistence**: read/write progress for active profile
- **useTelemetry**: read optOut from active profile

## Flow

1. App load → useProfile loads schema, migrates if needed
2. Profile selector (or default) → set activeProfileId
3. Play uses active profile's prefs, progress
4. Settings page → ParentGate → if passed, show difficulty/hints toggles
