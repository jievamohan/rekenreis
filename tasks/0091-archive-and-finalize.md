---
id: "0091"
title: "archive-and-finalize"
owner: "orchestrator"
status: "done"
scope_in:
  - "Create scripts/ci/gh_archive_artifacts.sh"
  - "Copy artifacts/current → artifacts/archive/<epic-id>/<timestamp>"
  - "Integrate archive into gh_finalize_feature.sh (after CI watch succeeds)"
  - "Update .gitignore for artifacts/archive if needed"
scope_out:
  - "Changing artifact content schema"
  - "Game features"
acceptance:
  - "gh_archive_artifacts.sh derives epic-id from branch (e.g. feat/epic16-x → epic16)"
  - "gh_archive_artifacts.sh uses timestamp format YYYYMMDDTHHMMSSZ"
  - "gh_finalize_feature.sh calls archive after CI green"
  - "artifacts/archive/<epic-id>/<timestamp>/ contains copy of artifacts/current"
  - "Archive failure does not block finalize success (best-effort)"
  - "Unit test or smoke: run archive and verify archive dir exists"
lanes:
  - name: "I"
    files: ["scripts/ci/**", ".gitignore"]
gates: ["C", "D", "F"]
risks:
  - tag: "infra"
    note: "Best-effort archive; no blocking"
---

## Context

Part of artifact lifecycle hardening. Archives completed feature runs for audit trail.

## Dependencies

Task 0090 (artifacts-current-and-scripts) must be done first.
