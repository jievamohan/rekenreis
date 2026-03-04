# Epic 10 — Child Profiles: QA

## Acceptance

- Create profile with name/avatar
- Switch between profiles; each retains own progress, prefs
- Parent gate: hold 3s or arithmetic unlocks settings
- Settings: difficulty ceiling, hints on/off per profile
- Migration: existing single-user data becomes default profile
- Typecheck, security, bundle budget pass

## Test Plan

| Area | Type | Coverage |
|------|------|----------|
| profileSchema | Unit | load, save, migration, validation |
| useProfile | Unit | create, switch, active profile |
| ParentGate | Unit | hold timing, arithmetic |
| Integration | Unit | play uses profile data |
