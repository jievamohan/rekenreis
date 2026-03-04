# CI Speed: Docker Build Cache + Optimalisaties

Versnel GitHub Actions door Docker image cache en andere optimalisaties.

**Scope:**
- Docker Buildx + GHA cache voor zap-baseline (web + api images)
- Pip cache voor semgrep in gate-d
- Documentatie cache-strategie

**Non-goals:**
- Registry push
- CI job restructuring

## Tasks

- [x] 0085-docker-buildx-cache-zap
- [x] 0086-pip-cache-gate-d
- [x] 0087-docs-runbooks-ci-cache

## PR Metadata
- Base: main
- Branch: feat/ci-speed-docker-cache
- PR: #34
- URL: https://github.com/jievamohan/rekenreis/pull/34
