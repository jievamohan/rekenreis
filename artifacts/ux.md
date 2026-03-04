# Epic 7 — UX Design

## Mode Selector UI

- **Entry point**: Reachable from /play — either:
  - A "Change mode" / "Choose game" button in nav/settings area, or
  - First-visit flow: when no stored preference, show selector before game
- **Layout**: Big buttons with icons (kid-friendly)
  - Mode options: Classic, Timed Pop, Build Bridge
  - Optional: Skin selection (or keep skin picker on play page)
- **Remember last**: localStorage; on next /play visit, apply stored mode/skin
- **Touch targets**: Large, WCAG 2.1 AA minimum 44×44px

## Build-Bridge Mode

- **Visual**: Gap/bridge graphic; planks (or tiles) labeled with answer options
- **Interaction**: Drag correct plank into the gap; or keyboard: focus plank → select → focus slot → place
- **Feedback**: Correct — celebratory; Wrong — gentle hint ("Try another number"), no punitive messaging
- **No fail state**: Child can retry; wrong answers don't block progress

## Accessibility

- Keyboard: select plank (focus) → move to slot (arrow keys or tab) → place (Enter/Space)
- Or: click/tap to select plank, click slot to place (no drag required)
- Focus indicators visible; no keyboard traps
