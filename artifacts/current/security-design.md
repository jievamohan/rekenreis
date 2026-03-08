# Security/Privacy — Epic 28

**New risks:** None.

- No new auth, payments, or external APIs
- No new PII or sensitive data
- Local storage schema change: allow stars 0–3 (backward compatible)
- No config injection; thresholds are code/content, not user input

**Checks still required:** yes — ensure no user-controlled values affect star computation (only session outcomes).
