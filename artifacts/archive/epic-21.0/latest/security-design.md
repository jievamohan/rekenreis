# Epic 21: Security & Privacy Design

**Role:** Security & Privacy  
**Scope:** Minigames, minigame map, shuffle-bag serving, difficulty progression, Dutch i18n

---

## 1. Risk Assessment

| Area | Risk | Notes |
|------|------|-------|
| Minigames | LOW | Client-side only; no new API endpoints, no server logic |
| Minigame map | LOW | Static JSON; no user input, no injection |
| Shuffle-bag / RNG | LOW | Deterministic; no cryptographic use, no security-sensitive randomness |
| Difficulty progression | LOW | Config-driven; no user-controlled params |
| i18n (nl.json) | LOW | Static file; no user input in lookup keys |

---

## 2. Data Collection

- **No new data collection:** Epic 21 does not introduce analytics, tracking, or PII handling
- **Persistence:** Existing localStorage use unchanged; no new stored data

---

## 3. Content Security

- **minigame-map.v1.json:** Static asset; no eval, no dynamic script; schema validation prevents malformed data from causing runtime errors
- **nl.json:** Static asset; no interpolation of user input; keys are developer-controlled

---

## 4. Injection / XSS

- **Minigames:** Render question data (numbers) and i18n strings; no raw HTML from user
- **i18n:** `t(key)` returns static strings; keys are not user-supplied
- **Verdict:** No injection risk from Epic 21 changes

---

## 5. Privacy

- **No change:** Local-only persistence; no new external requests; no new identifiers
- **Kindergarten audience:** No accounts, no auth; design remains child-safe

---

## 6. Auth / Crypto / Payments

- **None involved:** Epic 21 has no auth, crypto, or payment flows
- **No new secrets:** No API keys, tokens, or credentials

---

## 7. Verdict

**Overall risk: LOW**

- Client-side feature only
- Static content files
- No new data collection or external calls
- No auth, crypto, or payments

**Required checks:** None beyond standard Gate D (secrets scan, SAST, dependency audit). No additional security artifacts needed for Epic 21.
