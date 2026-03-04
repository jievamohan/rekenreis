# Epic 10 — Child Profiles: Solution

## Task Breakdown (5 tasks)

1. **profile-schema** (W2): ProfileSchemaV1, profiles + activeProfileId, load/save, migration from single-user
2. **useProfile-composable** (W2): useProfile() — activeProfile, switchProfile, createProfile
3. **profile-selector-ui** (W1): ProfileSelector component, profile creation, avatar picker
4. **parent-gate** (W1): ParentGate component — hold 3s or arithmetic
5. **play-integration-profiles** (W1,W2): Wire play to useProfile; per-profile prefs; settings page with gate

## Scope Reduction

- Avatar: 4 simple options (emoji or CSS shapes)
- Parent gate: both options (hold + arithmetic) — user chooses
- Settings: difficulty ceiling + hints toggle only
