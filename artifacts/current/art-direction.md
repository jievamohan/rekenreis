# Epic 22: Art Direction

**Artifact:** `art-direction.md`  
**Author:** art-director

---

## Visual Intent

Keep the existing kid-friendly underwater identity, but distinguish mechanics through composition and affordances (not palette swaps alone).

## Per-Mechanic Visual Language

- **Drag/Drop:** clear source-vs-target zoning, grab affordances, placement confirmation.
- **Timed-pop:** sparse field, high readability targets, calm timer indicators.
- **Sort-into-bins:** persistent bins with icon+label categories.
- **Build-sequence:** ordered track with slot numbers and progress markers.

## Token Guidance

Use existing theme tokens and add mechanic-scoped aliases only:

- `--mg-drag-accent`
- `--mg-pop-accent`
- `--mg-sort-accent`
- `--mg-seq-accent`
- `--mg-focus-ring`

## Motion & Icon Constraints

- Rounded, high-contrast shapes sized for child tap targets.
- Icons remain simple SVG and readable at small sizes.
- Reduced motion replaces movement with static state changes.

## Do / Don't

- **Do:** differentiate via layout grammar and input affordances.
- **Do:** preserve accessibility and Dutch readability.
- **Don't:** ship "new" games that are just skin/background variants.
- **Don't:** add heavy graphics dependencies.
# Epic 22 Art Direction

## Intent

Keep the existing kid-friendly underwater world, while making each minigame mechanic visually distinct through composition, affordances, and interaction cues rather than mere recolors. Maintain comfort-first UX with reduced-motion compliance and no dependency-heavy visual stack changes.

## Core Principles

- Preserve the established underwater tone: soft depth gradients, rounded silhouettes, playful marine motifs.
- Differentiate mechanics by spatial layout, object behavior cues, and iconography first; color is secondary.
- Prioritize readability for children: high figure-ground contrast, large hit targets, simple semantic icons.
- Respect accessibility: reduced motion must remain fully understandable with static alternatives.
- Reuse existing rendering/UI pipeline; additive tokens and small icon assets only.

## Visual Language by Interaction Type

### 1) Drag-Drop

- **Composition:** One source zone and one or more clear destination zones with generous spacing.
- **Affordance:** Draggable items use a subtle lift treatment (shadow/rim) and grabbable handle cue.
- **State cues:**  
  - Idle: neutral card/chip with slight depth.  
  - Hover/focus: destination zones gain outline + soft glow ring.  
  - Valid drop: destination pulses once (or static highlight in reduced motion).  
  - Invalid drop: brief shake replacement is color/outline swap in reduced motion.
- **Feedback iconography:** check bubble for success, soft X bubble for mismatch.

### 2) Timed-Pop

- **Composition:** Central play field with clean safe margins; spawn lanes must avoid UI overlap.
- **Affordance:** Targets are circular, high-contrast “pop” bubbles with immediate tap/click readability.
- **Urgency language:** Use ring depletion or border countdown around targets, not screen-wide effects.
- **State cues:**  
  - Pre-pop: clear target outline.  
  - Active window: brighter rim/token color.  
  - Expired: fade/ghost state (or instant desaturate in reduced motion).
- **Scoring feedback:** local floating score chip near interaction point; suppress travel-heavy particle trails.

### 3) Sort-Into-Bins

- **Composition:** Persistent bins anchored to one edge (bottom or side), sortable items in staging area.
- **Affordance:** Bins are visually coded by icon + label + accent token; never color-only distinction.
- **State cues:**  
  - Bin ready: open-lid silhouette or active rim.  
  - Correct placement: brief settle and check marker.  
  - Incorrect: item returns to staging with clear mismatch icon.
- **Guidance overlays:** optional ghost path/arrow hint in onboarding only.

### 4) Build-Sequence

- **Composition:** Linear or radial step track with explicit start/end anchors.
- **Affordance:** Sequence slots show ordinal markers (1, 2, 3...) plus symbolic cue.
- **State cues:**  
  - Locked future steps: muted but legible.  
  - Current step: primary accent ring.  
  - Completed step: filled marker + check shell icon.
- **Error recovery:** incorrect order shows local correction cue at the affected step only; avoid whole-board reset animation.

## Palette and Token Guidance

Use current design tokens as baseline. Add only minimal mechanic-specific aliases.

### Additive Token Set (proposed aliases)

- `--mg-drag-accent`
- `--mg-pop-accent`
- `--mg-sort-accent`
- `--mg-seq-accent`
- `--mg-success`
- `--mg-error`
- `--mg-focus-ring`
- `--mg-reduced-motion-highlight`

### Token Rules

- Each mechanic gets one accent token for primary interactive affordances.
- Keep global semantic tokens (`success`, `warning`, `error`) consistent across mechanics.
- Maintain WCAG-friendly contrast for text/icons against underwater backgrounds.
- Use hue shifts conservatively; mechanics should feel like one family, not separate themes.

## Shape, Icon, and Motion Constraints

### Shape Style

- Rounded geometry, soft corners, and bubble-like forms consistent with underwater language.
- Distinct mechanic silhouettes:
  - Drag-drop: pill/cards with handle cue.
  - Timed-pop: circles/bubbles.
  - Sort-into-bins: container silhouettes.
  - Build-sequence: step nodes/track markers.
- Avoid sharp, aggressive spikes or metallic realism.

### Icon Style

- Simple, filled or semi-filled icons with thick strokes for child readability.
- Include icon + text for key labels; never icon-only for core instructions.
- Reuse current icon set where possible; add only missing mechanic icons.

### Motion Style

- Default motion: short, purposeful, low-amplitude transitions.
- No decorative parallax storms, excessive particles, or camera-like movement.
- Reduced motion mode:
  - Replace movement with opacity/outline/state swaps.
  - Remove bounce/shake/fly-to animations.
  - Keep timing feedback via static countdown indicators and color/shape changes.

## Do / Don’t (Anti-Reskin Guardrails)

### Do

- Differentiate mechanics through layout grammar and interaction affordances.
- Use consistent semantic feedback patterns across all minigames.
- Keep children-first clarity: large targets, obvious states, forgiving spacing.
- Encode meaning with at least two channels (shape + icon, or icon + label).

### Don’t

- Don’t ship mechanic variants that only change color/background art.
- Don’t rely on animation alone to communicate correctness or urgency.
- Don’t introduce one-off visual styles that break underwater cohesion.
- Don’t add heavy visual libraries/frameworks for effects that CSS/tokens can handle.

## Asset Notes

- **Placeholders allowed:** temporary monochrome SVG icons for any missing mechanic-specific symbols.
- **Potential new icons (small set):**
  - drag handle
  - pop target ring
  - sort bin category markers (2-4 generic variants)
  - sequence step/checkpoint marker
- **Format guidance:** prefer lightweight SVG; keep paths simple and styleable via tokens.
- **No large new art packs** required for this epic; prioritize recomposition of existing assets and UI primitives.

## Implementation Notes for Design/Engineering Handoff

- Implement distinctions primarily in component composition and token mapping.
- Keep motion behavior behind existing reduced-motion checks.
- Validate every mechanic in both default and reduced-motion modes before sign-off.
- If a new visual treatment cannot be expressed with existing stack, escalate before adding dependencies.
# Art Direction — Epic 21.6

**N/A:** No new assets. Reuse existing minigame visuals and design tokens.
