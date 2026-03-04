---
id: "0091"
title: "zap-workflow-speed"
owner: "orchestrator"
status: "pending"
scope_in:
  - "Add docker-bake.hcl for parallel web+api build"
  - "Replace sequential build-push-action steps with docker buildx bake"
  - "Add restore-keys to mysql and zap actions/cache"
  - "Run 4 ZAP baseline scans in parallel (background + wait)"
  - "Tighten health wait: 5s + 12×2s (max 29s) instead of 5+36×5s"
  - "Optional: ZAP -m 1 if -m 2 causes >90s"
scope_out:
  - "Reducing ZAP URL coverage"
  - "Artifactory (unless explicitly configured)"
  - "Changing other gates"
acceptance:
  - "zap-baseline job completes; CI green"
  - "All 4 ZAP targets scanned (web /start, /play; api /api/health, /api/session-stats)"
  - "Security headers check still runs"
  - "On cache-hit run: ZAP job ≤120s (stretch ≤90s)"
  - "Reports in artifacts/current/zap/"
lanes:
  - name: "I"
    files: [".github/workflows/gates.yml", "docker-bake.hcl"]
gates: ["C", "D", "F"]
risks:
  - area: "ci"
    note: "Parallel ZAP may stress stack; monitor for flakiness"
  - area: "infra"
    note: "Cache restore-keys may cause first run slower after key change"
---

## Context

Epic: ZAP workflow speed. Current job ~6 min; target ≤90s. Parallelize builds (bake), ZAP scans, and tighten health wait.
