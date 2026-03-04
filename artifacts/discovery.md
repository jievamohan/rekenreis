# Epic 0: Game Core MVP — Discovery

## User goal(s) and success metrics

- **Primary**: Kids (age ~6) can practice addition in a playable loop at `/play`.
- **Success metrics**:
  - Playable: generate questions, select answers, get immediate feedback, advance to next question.
  - Score/streak visible; progression feels continuous.
  - Accessible via keyboard and focus.
  - No regression: vertical-slice (`/start` + API health) and smoke test remain green.

## Scope_in

- `/play` route in apps/web (Nuxt 3 + Vue 3 + TS).
- Addition-only core loop with two modes: **up to 10** (sums ≤ 10), **up to 20** (sums ≤ 20).
- Question generator: a + b = ? with 3–4 multiple choice answers (one correct, rest plausible distractors).
- Immediate feedback per answer (correct/incorrect), then next question.
- Streak and score display.
- Minimal UI, production-grade data models for future skins/levels.
- Unit tests for generator correctness and choice uniqueness.
- Keyboard navigation and focus management (accessible).
- No minigame skins; no backend persistence/auth.

## Scope_out

- Subtraction, multiplication, division, or other operations.
- Minigame skins or thematic layers.
- Backend persistence, auth, user accounts.
- High scores stored server-side.
- DB migrations, API changes for game logic.
- CI/infra changes beyond what’s required for new tests.

## Functional requirements (bulleted, testable)

1. **Question generation**
   - Produce `{ a, b, correctAnswer, choices }` where `a + b = correctAnswer`, `choices` is 3–4 unique numbers including `correctAnswer`.
2. **Modes**
   - “Up to 10”: `a + b ≤ 10`; “Up to 20”: `a + b ≤ 20`.
3. **UI**
   - Show question, 3–4 answer buttons, score, streak.
   - On answer: show feedback, then next question.
4. **Accessibility**
   - Tab order, focus visible, keyboard-selectable answers.
5. **Regression**
   - `/start` still renders API health; existing api.test.ts and HealthTest pass.

## Acceptance criteria templates (Given/When/Then)

- **AC-1**: Given mode “up to 10”, When a question is generated, Then `a + b ≤ 10` and `choices` contains exactly one correct value.
- **AC-2**: Given mode “up to 20”, When a question is generated, Then `a + b ≤ 20`.
- **AC-3**: Given any question, When inspecting `choices`, Then all values are unique.
- **AC-4**: Given the play page, When user selects an answer, Then immediate feedback appears; When user proceeds, Then next question loads.
- **AC-5**: Given the play page, When user answers correctly, Then streak increments; When incorrect, Then streak resets.
- **AC-6**: Given the play page, When using keyboard only, Then user can navigate and select answers.
- **AC-7**: Given the repo, When running existing tests and smoke, Then all pass (no regression).

## Edge cases + failure modes

- Mode switch mid-game: undefined; acceptable to require page reload.
- Empty/zero operands: allow `0 + 0` in “up to 10”.
- Extremely large number of questions: not bounded; acceptable for MVP.

## Dependencies and constraints

- Nuxt 3, Vue 3, TypeScript (strict).
- Vitest for unit tests.
- No new npm deps unless justified.
- Docker compose + vertical slice must stay green.

## Risk tags

- **perf**: Minor—generator runs client-side; negligible.
- **deps**: Low—no new deps planned.

## Assumptions + open questions

- Assumed: age ~6 implies simple UI, large touch targets.
- Assumed: “up to 10/20” refers to sum (result), not operand bounds.
- Open: exact number of choices (3 or 4)—default to 4, configurable via data model for extensibility.
