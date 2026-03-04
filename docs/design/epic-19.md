# Epic 19 Design Bible — Aggressive Underwater Reskin Sprint

> PlanRef (master): artifacts/archive/epic-19.0/latest  
> This is a living document. Each planning agent owns its chapter only.

---

## 1. Vision & Success Criteria (BA + Game Designer)

- **Target audience**: Kleuters (4–7) and parents; same as existing product
- **Primary experience goal**: Every screen feels like a game world, not a form. No white app look anywhere. Cohesive underwater theme.
- **"Looks/feels like" acceptance criteria**:
  - User opens any page → sees underwater environment (gradients, patterns, themed surfaces)
  - Navigation feels part of the world (nav tabs with underwater icons)
  - 10+ underwater SVG assets visible (fish, bubbles, seaweed, coral)
  - a11y preserved; reduced motion respected
- **Non-goals**: New game modes, backend changes, new content packs, monetization

## 2. Visual Direction (Art Director)

- **Theme directive**: Underwater world — deep blues, teals, aqua, coral accents. Playful, kid-friendly.
- **Color palette**:
  - `--app-bg`: Deep water gradient (#0d47a1 → #006064 → #00838f)
  - `--app-surface`: Semi-transparent glass (#ffffff20) or soft teal (#b2dfdb)
  - `--app-primary`: Coral/orange (#ff8a65) or bright aqua (#00bcd4)
  - `--app-text`: Near-white (#e0f7fa) or dark (#004d40) for contrast
  - Remove #ffffff as dominant surface
- **Typography**: Nunito or Fredoka One for headings; playful, readable
- **Shapes**: Rounded corners, bubble-like surfaces, organic decorative elements
- **Icon style**: SVG line/filled icons — fish, bubbles, seaweed, coral, shell
- **Background patterns**: Subtle bubble pattern, gentle wave overlay, low opacity
- **Do/Don't**: High contrast for text; no pure black/white dominant; no busy patterns

## 3. UX Layout & Components (UX Designer)

- **Primary screens impacted**: /, /start, /play, /stickers, /summary, /settings
- **Global shell structure**: Top bar (profile + Choose game), main stage (GameStageCard), bottom NavTabs
- **Navigation model**: Same routes; NavTabs with SVG icons (fish, chart/bubbles, gear/coral)
- **Component catalog**: AppShell, GameStageCard, NavTabs, PrimaryButton, SecondaryButton, StatPill, ProfileSelector, PlayModeSelector — all themed
- **Tap targets & accessibility**: Keep 44px min; visible focus states; skip link preserved

## 4. Motion & Audio Rules (Motion/Audio)

- **Animations list**: Existing only; no new animations required
- **Timing/easing**: `--app-transition: 0.2s ease`; reduced motion → 0s
- **Reduced motion behavior**: All transitions respect `prefers-reduced-motion`; static fallback for any animated patterns
- **Sound rules**: No changes; existing SFX remain

## 5. Accessibility (UX + QA)

- **Keyboard model**: Unchanged; focus order preserved
- **Focus states**: 2px solid outline, visible on all interactive elements
- **Contrast**: WCAG AA on dark backgrounds (light text on dark, or dark text on light surfaces)
- **Reduced motion**: Mandatory; no parallax or floating animations without fallback
- **Screen reader expectations**: Same as today; no structural changes

## 6. Technical Implementation Notes (Principal Architect + Solution Designer)

- **Where tokens live**: `apps/web/assets/css/tokens.css`, `graphics.css`
- **Where shell lives**: `layouts/default.vue`, `AppShell.vue`, `GameStageCard.vue`, `NavTabs.vue`
- **Component folder structure**: `assets/graphics/backgrounds/`, `objects/`, `icons/` (new)
- **Asset pipeline rules**: SVGs via `~/assets/`; background patterns via CSS or SVG; < 50KB new assets
- **Performance constraints**: Bundle size budget must pass (Gate F)

## 7. Test Strategy & Regression Plan (QA Strategist)

- **Unit tests**: No new logic; existing tests remain
- **E2E smoke updates**: Update selectors if class names change; verify nav, play, mode selector
- **Non-flaky UI assertions**: Prefer role/label over class names
- **Visual regression**: Manual check per page; document in design bible

## 8. Security/Privacy Notes (Security/Privacy)

- **New risks**: None — purely visual (CSS, SVG)
- **Config constraints**: SVG assets must not embed scripts or external fetches
- **Data handling**: No changes

## 9. Slice Map (Orchestrator)

| Slice | Title | Visual Milestone | Files/Modules |
|-------|-------|------------------|---------------|
| **19.1** | Tokens & No-White | App uses underwater palette; no #fff surfaces | tokens.css, graphics.css, GameStageCard, app.vue |
| **19.2** | Shell & Nav Redesign | New shell and nav with underwater theme | AppShell, GameStageCard, NavTabs, icons |
| **19.3** | Underwater Asset Pipeline | 10+ SVGs + patterns visible | assets/graphics/, backgrounds, objects |
| **19.4** | Page Unification | All pages themed | index, start, play, stickers, summary, settings |
| **19.5** | Polish & a11y | Contrast, reduced motion verified | tokens, components, docs |
