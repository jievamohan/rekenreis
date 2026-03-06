# Epic 22: Security & Privacy Design

**Artifact:** `security-design.md`  
**Author:** security-privacy

---

## Threat Surface

- Metadata-driven minigame config is treated as untrusted input and validated at runtime.
- Local settings/state storage is user-modifiable and must be schema-checked on read.
- CI policy scripts are part of trusted enforcement and must be deterministic.

## Key Risks

- Misconfigured metadata bypassing timer safety or accessibility behavior.
- Invalid values (negative timers, extreme counts) causing unstable UX.
- Duplicate `interactionType + layoutClass` passing unintentionally without justification.

## Mitigations

- Strict contract validation with fail-closed defaults.
- Value clamping for timer/difficulty ranges.
- CI Diversity Gate with explicit diagnostics.
- Test coverage for timeout/hint continue path and keyboard fallback.

## Privacy

- Local-only gameplay state; no new PII collection.
- No new network endpoints required by this epic.

## Gate D Security Checks

- gitleaks clean
- semgrep clean (or documented/approved findings)
- `docker compose exec web pnpm audit --prod`
- `composer audit`

## Sensitive Domain Impact

- Auth impact: none
- Crypto impact: none
- Payments impact: none
- Overall risk: medium-low (configuration integrity, not data confidentiality)
# Security Design - Epic 22 Minigame Mechanics Overhaul

## Threat Surface and Trust Boundaries
- **Primary trust boundary:** gameplay runtime logic (trusted code) vs. minigame metadata/config payloads (untrusted input, even when shipped with the app).
- **Secondary trust boundary:** player-triggered events (rapid input, pause/resume, focus changes, viewport/orientation changes) vs. deterministic game-state transitions.
- **UI boundary:** accessible overlays (timers, prompts, feedback banners) must not bypass cooldown, lock, or safety checks in game state.
- **Storage boundary:** local persistence (browser storage/session cache) is treated as user-modifiable and therefore untrusted on read; values require schema validation and safe defaults.
- **Build/runtime boundary:** CI artifacts and static content delivery are trusted only after Gate D security checks pass; no runtime trust in external remote config for minigame rules.

## Abuse/Misconfiguration Risks for Metadata-Driven Minigames
- **Schema drift risk:** missing/renamed metadata fields can silently disable guardrails (timer caps, difficulty ramps, retry limits). Mitigation: strict schema validation with fail-closed defaults.
- **Out-of-range values:** negative durations, extreme spawn rates, unbounded score multipliers, or oversized arrays can create denial-of-fun, hangs, or memory pressure. Mitigation: clamp numeric ranges and enforce max collection sizes.
- **State-machine bypass:** malformed metadata may skip required phases (intro -> play -> end), causing reward logic or completion events to fire incorrectly. Mitigation: explicit state transition whitelist.
- **Unsafe feature flags:** enabling debug knobs or hidden mechanics via metadata can expose unintended behavior in production. Mitigation: environment-gated flags and production denylist.
- **Localization/content injection:** metadata-rendered labels/tooltips could contain unsafe markup if later sourced externally. Mitigation: render as plain text, never evaluate HTML/script from metadata.
- **Version mismatch:** old metadata with new engine behavior can cause inconsistent rules and a11y regressions. Mitigation: metadata version field + compatibility check + hard stop on mismatch.

## Kid-Safe Timer and A11y Safety Notes
- **Timer guardrails:** enforce minimum and maximum round durations; prevent infinite countdown and prevent instant-expire values.
- **Pacing safety:** include pause-safe behavior on tab blur/focus changes to avoid involuntary timeout while attention shifts.
- **Reduced stress defaults:** avoid punitive sudden-death timing by default; keep retries and recovery windows predictable for younger players.
- **Accessible communication:** timer state changes must be conveyed through non-color-only cues (text/icon/audio optionality) and remain understandable for color-vision differences.
- **Motion/audio safety:** respect reduced-motion and sound preference settings; avoid flashing/high-frequency cues that can overwhelm sensitive users.
- **Input fairness:** keyboard/switch/touch paths should have equivalent timing opportunities, avoiding mechanics that require precision only achievable with one modality.

## CI/Policy Security Checks Relevant to Gate D
- **Secrets scanning:** `gitleaks` must pass (no credentials, tokens, or API keys in metadata, fixtures, or generated files).
- **SAST baseline:** `semgrep` (auto profile) must pass, or findings must be explicitly documented and approved before merge.
- **Dependency audits (web):** `docker compose exec web pnpm audit --prod` must pass or have approved risk acceptance.
- **Dependency audits (api):** `composer audit` must pass or have approved risk acceptance.
- **Policy for metadata inputs:** tests should assert schema validation and fail-closed behavior for malformed or adversarial minigame metadata.
- **Merge gate rule:** Gate D is not considered PASS unless all above checks are green and artifacts are present for current run.

## Privacy and Data Handling (Local Only)
- **Data locality:** minigame runtime data is local-only (client memory and optional local browser storage); no analytics or telemetry required for this epic.
- **Data minimization:** store only what is needed for gameplay continuity (settings/progress), never personal identifiers.
- **No sensitive categories:** no auth credentials, payment information, health data, or precise location data is collected or persisted.
- **Retention:** keep local data short-lived or user-resettable; prefer overwrite/expire semantics for transient session stats.
- **Export/sharing:** disabled by default; if added later, require explicit user action and clear disclosure.

## Risk Rating and Sensitive-Domain Impact
- **Overall risk rating:** **Medium** (primary risks are integrity/availability of gameplay through metadata misuse, not confidentiality breach).
- **Highest residual risk:** misconfigured metadata degrading fairness, accessibility, or safe pacing for younger users.
- **Auth impact:** **None** - no authentication or authorization logic is introduced or modified.
- **Crypto impact:** **None** - no cryptographic primitives, key handling, or encryption workflows are introduced or modified.
- **Payments impact:** **None** - no payment flows, billing logic, or purchase entitlements are introduced or modified.
- **Security policy note:** because auth/crypto/payments impact is none, high-risk fail-closed escalation is not triggered for those domains in this epic.
# Security Design — Epic 21.6

**N/A:** Client-side only; no new API endpoints, no auth/crypto/payments.

Standard Gate D checks sufficient per Epic 21 design bible.
