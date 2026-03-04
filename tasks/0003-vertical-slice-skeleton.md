---
id: "0003"
title: "vertical-slice-skeleton"
owner: "orchestrator"
status: "ready"
scope_in:
  - "Add a minimal end-to-end slice: Nuxt page calls Laravel endpoint"
  - "Wire env/config so web can reach api in docker compose"
  - "Keep response deterministic (no auth, no game logic)"
scope_out:
  - "Any math game logic, level system, minigames, persistence beyond minimal proof"
  - "Authentication/roles/permissions"
acceptance:
  - "Web has a page `/start` that calls API and renders the returned JSON"
  - "API exposes `GET /api/health` (or `/health`) returning `{ status: 'ok', version: <string> }`"
  - "Running via docker compose brings up web+api+mysql, and `/start` renders status ok"
  - "Unit tests exist for: web fetch helper (mocked) and api endpoint response"
  - "All gates pass (C,D,F) and CI is green on PR"
lanes:
  - name: "W1"
    files: [ "apps/web/pages/**", "apps/web/components/**" ]
  - name: "W2"
    files: [ "apps/web/composables/**", "apps/web/services/**", "apps/web/utils/**" ]
  - name: "A1"
    files: [ "apps/api/routes/**", "apps/api/app/Http/Controllers/**" ]
  - name: "A2"
    files: [ "apps/api/app/Services/**", "apps/api/app/Domain/**" ]
  - name: "T"
    files: [ "apps/web/**/__tests__/**", "apps/api/tests/**" ]
  - name: "I"
    files: [ "docker-compose.yml", ".env.example", "apps/**/Dockerfile", "docs/runbooks/**" ]
gates: ["C","D","F"]
risks:
  - area: "infra"
    note: "Docker networking + env wiring; keep changes minimal and documented"
  - area: "perf"
    note: "Keep page lightweight; no heavy deps"
---

## Context
We need the smallest possible end-to-end slice to prove boundaries and enable E2E in the next task.

## Constraints
- No auth.
- No DB schema changes unless absolutely required (prefer none).
- Container-first execution.

## Test notes
- Web: unit test the API client/helper with mocked fetch.
- API: unit test the controller/route returns expected JSON.