# Discovery — Epic 24.4 (PlanRef)

Epic 24.4: Fine-tune tot spinup (Build + Start) nagenoeg instantaan.

**Scope (slice 24.4):**
- Pas eventuele extra optimalisaties toe (volgorde, parallelisatie, etc.)
- Doel: spinup Build + Start significant korter dan ~1m30s
- Documenteer finale config in docs/runbooks/e2e-benchmark.md
- Alle Playwright tests blijven groen

**Context:** 24.1 (benchmark), 24.2 (MySQL cache), 24.3 (build cache) zijn gedaan.
