# Epic 21: Discovery (Business Analyst)

**Epic:** Minigame expansion + Dutch UI copy  
**Artifact:** discovery.md  
**Author:** business-analyst

---

## Problem Statement

Rekenreis is a kindergarten math game targeting Dutch kleuters (4–6 year olds). Two gaps limit its effectiveness and adoption:

1. **Limited engagement variety** — The app currently offers three game modes (classic, timed-pop, build-bridge). Young children fatigue quickly when interaction patterns repeat. Expanding to six distinct minigames increases variety, sustains attention, and supports different learning styles (visual, kinesthetic, timed).

2. **Language mismatch** — All UI copy is hardcoded in English. The primary audience is Dutch-speaking kleuters and their parents. Dutch is required for:
   - Classroom and home use in the Netherlands and Flanders
   - Parent trust and comprehension of settings/progress
   - Accessibility for children who are not yet bilingual

---

## Target Users

| User | Age / Role | Needs |
|------|------------|-------|
| **Kleuter** | 4–6 years | Simple, playful math practice; varied interactions; no punitive failure; clear feedback |
| **Parent** | Adult | Dutch UI; progress visibility; safe, age-appropriate content; minimal setup |
| **Educator** | Teacher / caregiver | Dutch interface; alignment with Dutch curriculum; predictable difficulty progression |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Engagement variety** | Minigame diversity used per session | Track minigame IDs served; aim for ≥3 distinct minigames per 10-round session |
| **Session length** | Sustained play | Median session duration ≥5 minutes (vs. baseline) |
| **Completion rates** | Level/pack completion | % of sessions reaching level-end or pack-end; no regression vs. current |
| **Dutch adoption** | Full NL coverage | 100% of UI strings from single source; lint gate for no hardcoded English |
| **Accessibility** | Keyboard playable | All minigames pass keyboard-only play; prefers-reduced-motion respected |

---

## Key User Stories

### Kleuter

- **US-1:** As a kleuter, I want different ways to answer math questions (tap bubbles, drag gems, feed fish, etc.) so playing stays fun.
- **US-2:** As a kleuter, I want the game in Dutch so I understand the buttons and messages.
- **US-3:** As a kleuter, I want to play without feeling punished when I make a mistake; I can try again or get a hint.
- **US-4:** As a kleuter, I want the game to work with keyboard or reduced motion if I need it.

### Parent

- **US-5:** As a parent, I want the entire app in Dutch so I can explain it to my child and adjust settings.
- **US-6:** As a parent, I want my child to encounter varied minigames so they stay engaged longer.
- **US-7:** As a parent, I want difficulty to increase gently so my child is challenged but not frustrated.

### Educator

- **US-8:** As an educator, I want level-to-minigame mapping to be configurable so I can align content with curriculum.
- **US-9:** As an educator, I want deterministic seeds for tests so I can reproduce scenarios.

---

## Dependencies and Risks

| Dependency | Impact | Mitigation |
|------------|--------|------------|
| Existing pacing engine | Minigame selection must integrate with `applyPacing` and `effectivePacingTag` | Extend pacing to consider minigame variety; no duplicate math logic |
| Level pack structure | `operandMin`/`operandMax` drive math; minigame params drive UX | Separate concerns: level config for math, minigame config for interaction params |
| Seedable RNG | Tests and reproducibility depend on deterministic behavior | Use `createSeededRng` for minigame selection; document seed usage |
| Dutch copy | Translation quality affects UX | Single source of truth; native review recommended post-MVP |

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Minigame overload | Medium | Cognitive overload for kleuters | Controlled random serving; no-repeat window; weighted pools |
| Regression in existing modes | Low | Broken classic/timed-pop/build-bridge | No changes to core math logic; minigames wrap same question/answer flow |
| Lint gate friction | Medium | Slows PRs | Clear docs; allow Dutch strings; exclude code identifiers |
| Asset scope creep | Medium | Delays delivery | SVG placeholders OK; art can follow incrementally |

---

## Out of Scope

- **i18n beyond Dutch** — Single locale (nl) only; no multi-locale framework in this epic.
- **Implementing all 6 minigames** — Epic invents and specifies them; implementation is phased (not all at once).
- **Heavy game engine** — CSS/SVG only; no Phaser, Unity, or similar.
- **New math operators** — Addition only; subtraction/multiplication out of scope.
- **Backend/API changes** — All content and logic remain in apps/web.
- **Monetization or accounts** — No payment, login, or cloud sync in this epic.
