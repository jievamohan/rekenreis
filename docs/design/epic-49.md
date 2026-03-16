# Epic 49 Design Bible — Locked Level Screen

> PlanRef (master): artifacts/archive/epic-49.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- Target audience: Kleuters, ouders, gebruikers die direct een level-URL openen
- Primary experience goal: Vriendelijke melding bij vergrendeld level; knop terug naar kaart
- "Looks/feels like" acceptance criteria: Maatje + bericht + "Terug naar de kaart"; positieve toon
- Non-goals: Wijziging unlock-logica; route-level blocking; nieuwe minigames

## 2. Visual Direction (Art Director)
- Theme: Consistent with underwater/maatje language; "friendly pause" not error
- Maatje: neutraal or nadenken (supportive)
- No red/error colors; reuse existing tokens
- Do: gentle redirect; Don't: harsh colors, scary imagery

## 3. UX Layout & Components (UX Designer)
- Primary screens impacted: play.vue
- Component: LockedLevelScreen — maatje above, message, "Terug naar de kaart" CTA
- Layout: Centered; AppShell wraps; no game UI visible
- Tap targets: min 44px; keyboard: Tab to button, Enter/Space

## 4. Motion & Audio Rules (Motion/Audio)
- Optional: gentle fade-in (200–300ms)
- Reduced motion: instant appearance
- No negative/error sounds

## 5. Accessibility (UX + QA)
- Button focus states visible
- Screen reader: announce message and CTA
- WCAG AA contrast (existing tokens)

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- Guard in play.vue: `levelParam !== null && !isUnlocked(levelParam)` → LockedLevelScreen
- useLevelProgress(profile) → isUnlocked
- Invalid levelParam (NaN, < 1, > total): treat as locked
- Component: components/play/LockedLevelScreen.vue
- i18n: lockedLevel.title, lockedLevel.subtitle, lockedLevel.backToMap

## 7. Test Strategy & Regression Plan (QA Strategist)
- E2E: e2e/locked-level.spec.ts — navigate to locked level, assert screen, click back
- Use fixture currentLevel=1 to guarantee level 50 locked
- Regression: /play?level=1 with unlocked profile still shows game
- Gate F: bundle budget pass

## 8. Security/Privacy Notes (Security/Privacy)
- Low risk: UX guard only; no new auth/API
- No new data collection
- Gate D unchanged

## 9. Slice Map (Orchestrator)

- Epic 49.1 — Locked Level Screen
  - Visual milestone: Maatje + melding + knop zichtbaar bij locked level URL
  - Files/modules: play.vue, LockedLevelScreen.vue, nl.json
  - Acceptance: Locked level URL → locked screen → back to map; E2E green; Gate C/D/F
