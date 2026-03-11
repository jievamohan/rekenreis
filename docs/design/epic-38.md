# Epic 38 Design Bible — Fish Visibility Fix + Screenshot

> PlanRef (master): artifacts/archive/epic-38.0/latest  
> Bugfix epic: fish not visible in browser after Epics 37.1–37.3.

---

## 1. Vision & Success Criteria (BA + Game Designer)
- Problem: Swimming fish implemented but browser shows no change
- Root cause: water-level div covers fish-ambient-layer (DOM stacking)
- Success: Multiple fish visibly swimming; Playwright screenshot proves it

## 2. Visual Direction (Art Director)
N/A: Bugfix. Fish already styled in Epic 37. Ensure they are visible.

## 3. UX Layout & Components (UX Designer)
- Fish must render above water-level timer fill
- Pellets, center fish, timer badge unchanged

## 4. Motion & Audio Rules (Motion/Audio)
N/A: No changes to animation. Fix rendering order only.

## 5. Accessibility (UX + QA)
No changes. Existing aria-hidden, reduced-motion preserved.

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)
- water-level: z-index: 0 (explicit, behind fish)
- fish-ambient-layer: z-index: 1 (above water)
- fish-zone: z-index: 2, pellets-zone: z-index: 3 (unchanged)
- E2E: fish-feed-visual.spec.ts with screenshot of aquarium showing ≥2 fish

## 7. Test Strategy & Regression Plan (QA Strategist)
- Screenshot: /play?level=3 with timersDisabled; assert .ambient-fish count ≥2
- Regression: minigame-result-modal fish-feed tests remain green

## 8. Security/Privacy Notes (Security/Privacy)
N/A: Cosmetic fix only.

## 9. Slice Map (Orchestrator)

- Epic 38.1 — Fish Visibility + Screenshot
  - Visual milestone: Fish visibly swimming above water
  - Files: MinigameFishFeed.vue, e2e/visual/fish-feed-visual.spec.ts
  - Acceptance: z-index fix, Playwright screenshot with ≥2 fish
