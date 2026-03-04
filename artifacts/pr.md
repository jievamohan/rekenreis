# Artifact Lifecycle Hardening

Introduce `artifacts/current` and `artifacts/archive/<epic-id>/<timestamp>`; update all scripts to read/write only `artifacts/current`; add archive step after finalize.

**Scope:**
- artifacts/current as working directory
- artifacts/archive for completed runs
- Script updates: PR bootstrap, ci-watch, ci-fetch-logs, finalize
- Archive step after finalize

**Non-goals:** Game features

## Tasks

- [ ] 0090-artifacts-current-and-scripts
- [ ] 0091-archive-and-finalize
