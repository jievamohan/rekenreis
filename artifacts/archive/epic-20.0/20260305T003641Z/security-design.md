# Epic 20 — Security Design

**Rekenreis** kindergarten math game. Security and privacy assessment for the UI rebuild (map, keypad, level complete modal, mistakes review).

---

## 1. New Risks Assessment

### 1.1 Map Page (`/map`)

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Level progress injection** | Child or sibling could tamper with `localStorage` to unlock levels. | Acceptable: local-only, no competitive/ranking impact. Parent gate protects settings; map is child-facing. No server-side validation needed. |
| **URL parameter manipulation** | `/map` or `/play?level=N` with arbitrary N. | Validate `level` against pack bounds. Reject or clamp out-of-range values. Use existing `levelPack` from `PACK_BY_MODE`. |
| **SVG path rendering** | Map path and nodes use inline SVG. | Path geometry is static (from design). No user-controlled SVG content. See §4. |
| **Scroll / layout** | Long path could cause layout or performance issues. | Use `overflow-y: auto`; no infinite scroll or unbounded DOM. |

### 1.2 Keypad (`/play` redesign)

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Input validation** | Child enters non-numeric or oversized value. | Keypad restricts to digits 0–9; max length based on `operandMax` (e.g., 2 digits for sum ≤ 20). No free-text input. |
| **Answer submission** | Malformed or empty submit. | Disable "Check" when input empty. `onAnswer(value)` receives number only. Existing `usePlayGame.selectAnswer(choice)` contract unchanged. |
| **Focus trapping** | Modal or overlay could trap keyboard users. | No trap on play screen. Keypad keys must be focusable; Tab order logical. See §5. |

### 1.3 Level Complete Modal

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Focus trap** | Modal opens; keyboard user cannot escape. | Use `role="dialog"`, `aria-modal="true"`, focus trap (first focusable = "Next" button). Escape key closes or advances (match `PlayModeSelector`). |
| **Confetti / animation** | `prefers-reduced-motion` ignored. | UX spec requires respect. Disable or simplify confetti when `prefers-reduced-motion: reduce`. No vestibular triggers. |
| **Overlay click** | Backdrop click could dismiss unexpectedly. | Match `PlayModeSelector`: backdrop click closes. Child intent = "Next" or "Review Mistakes"; explicit CTA preferred. |

### 1.4 Mistakes Review Screen

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Data exposure** | Wrong answers shown to sibling or parent. | Session-only data (in-memory). Optional: persist last N mistakes per profile; same device, same threat model as existing `ProfileProgress`. |
| **Content injection** | Problem text or answers from level data. | Level content from static JSON (`levels.*.v1.json`). No user-generated content. Numbers only. |
| **Shame / UX** | Harsh visuals could distress child. | Design: no red X marks; encouraging language. Security-adjacent: reduces incentive for tampering to hide mistakes. |

**Summary:** No new high-severity attack vectors. Map/keypad/modal/mistakes operate within existing trust boundary (localStorage, static content, no auth).

---

## 2. Data Handling

### 2.1 Current Schema (Pre–Epic 20)

- **Profile schema** (`profileSchema.ts`): `rekenreis_profiles_v1`
  - `ProfileProgress`: `bestScore`, `dailyGoal`, `totalRounds`, `totalCorrect`, `totalWrong`, `totalTimeout`, `modeCounts`
  - No PII beyond optional profile `name` (user-entered, local only)
- **Persistence schema** (`persistenceSchema.ts`): `rekenreis_progress` (legacy fallback)
  - `ProgressSchemaV1`: `version`, `bestScore`

### 2.2 Epic 20 Schema Extension

Per discovery.md, map requires **per-level completion**:

| Field | Type | Purpose |
|-------|------|---------|
| `completedLevels` | `number[]` | Level indices completed (e.g. `[0, 1, 2]`) |
| `levelStars` | `Record<number, number>` | Stars per level (0–3) |
| `currentLevelIndex` | `number` | Last played / next to play |

**Constraints:**
- Stored in `ProfileProgress` (extend `profileSchema.ts`).
- No PII. Only numeric indices and counts.
- Validation: `completedLevels` and `levelStars` keys must be valid level indices (0 to `pack.length - 1`).
- Migration: existing profiles get `completedLevels: []`, `currentLevelIndex: 0`.

### 2.3 Mistakes Data (Session-Only)

- **MVP:** In-memory `{ a, b, selectedAnswer, correctAnswer }[]` during play.
- **Optional later:** `lastMistakes: MistakeEntry[]` in `ProfileProgress` (e.g. last 5). Same schema rules: numbers only, no free text.

---

## 3. Config Constraints

| Constraint | Status |
|------------|--------|
| **No new secrets** | No API keys, tokens, or env vars for Epic 20. |
| **No new API endpoints** | All data local. `useApi.postSessionStats` remains optional telemetry. |
| **No new storage keys** | Extend `rekenreis_profiles_v1` only. No new `localStorage` keys. |
| **Content packs** | Static JSON in `content/`. No runtime fetch of untrusted URLs. |

---

## 4. Content Security (SVG Sanitization)

### 4.1 Current Practice

- SVGs are **static assets** (`assets/graphics/**/*.svg`) imported via Vite.
- Inline SVGs in components use fixed markup (e.g. `NavIconGearCoral.vue`, `HintDots.vue`).
- No `v-html`, `innerHTML`, or user-controlled SVG. Semgrep rule `.semgrep/rules/ts-security.yaml` flags `innerHTML` with user data.

### 4.2 Epic 20 Map SVG

- **MapPath:** Static `<path>` or `<polyline>` with fixed `d` attribute. No interpolation of user input.
- **LevelNode:** Icons (star, lock) from static assets or inline SVG. Level number from `levelPack` index (validated number).
- **Avatar:** `ProfileData.avatarId` — validated against `VALID_AVATARS` (`default`, `star`, `heart`, `circle`, `square`). No free-form image URL.

**Rule:** Never use `v-html` or `innerHTML` with level content, profile name, or any user input. If dynamic SVG is needed, use Vue templates with bound attributes (e.g. `:transform="..."`) and ensure values are numeric or from allowlists.

---

## 5. Accessibility as Security

Keyboard-only and assistive-tech users must not be locked out. Lockout = availability/security concern (child cannot play).

| Area | Requirement |
|------|-------------|
| **Map** | Tab order: profile → level nodes (unlocked only) → Play CTA. Locked nodes non-focusable or `aria-disabled`. |
| **Keypad** | Each digit key and "Check" focusable. `tabindex="0"` when active; `tabindex="-1"` when disabled (during feedback). Enter/Space to activate. |
| **Level complete modal** | Focus trap; first focusable = "Next". Escape advances or closes. `aria-labelledby` for title. |
| **Mistakes review** | Cards readable; "Try Again" / "Continue" focusable. Logical Tab order. |
| **Skip link** | Existing "Skip to game" in `play.vue`. Map page should have equivalent if header/nav precede main content. |

**Reference:** Existing patterns in `SkinClassic`, `ModeBuildBridge`, `PlayModeSelector` — `tabindex`, `@keydown.enter`, `@keydown.space`, `focus-visible` styles.

---

## 6. Conclusion

| Aspect | Assessment |
|--------|------------|
| **New attack surface** | Low. Map, keypad, modal, mistakes stay within local/static trust model. |
| **Data sensitivity** | Low. No PII in level progress. Profile name remains optional, local. |
| **Config/infra** | No new secrets or endpoints. |
| **SVG/content** | Static content; no user-controlled SVG. Enforce no `v-html` with user data. |
| **Accessibility** | Must preserve keyboard playability; existing patterns suffice. |

**Overall risk level: LOW**

**Justification:** Epic 20 is a UI rebuild. Data model extends existing `ProfileProgress` with numeric fields. No auth, no cloud sync, no payments. Parent gate unchanged. Security gates (gitleaks, semgrep, pnpm audit, composer audit) remain applicable. Main diligence: schema validation for new fields, keyboard accessibility for new components, and `prefers-reduced-motion` for confetti.
