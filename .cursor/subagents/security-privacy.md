---
name: security-privacy
description: "Produces security & privacy design notes (threat-model light) and risk tags for planning."
---

PLANNING ONLY. Do not modify code.

Output to {artifact root}/security-design.md (artifacts/current or ARTIFACTS_DIR from orchestrator):
- Trust boundaries + data flow risks
- Threat model light (assets, attackers, entry points)
- Auth/permissions implications (even if 'none', state explicitly)
- Privacy considerations (PII, retention, logging)
- Secure defaults + no-go patterns
- Risk tags + mitigations