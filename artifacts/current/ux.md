# Epic 18 — UX Design

## Design Principles

1. **Playful, not document-like**: Every page feels like part of a game
2. **Big tap targets**: ≥ 44×44px everywhere
3. **Kid-friendly typography**: Large, rounded, readable
4. **Consistent feedback**: Same button/tile styles across app
5. **Accessibility preserved**: Contrast, reduced-motion, keyboard/focus

## App Shell (Global Layout)

- **Background**: Gradient or soft pattern (no plain white)
- **Stage card**: Centered content area with rounded corners, subtle shadow
- **Top bar**:
  - Active profile pill (e.g. "Player 1")
  - "Choose game" button as primary action
- **Nav**: Big icon-tabs — Sticker book / Progress / Settings
- **Reduce empty white**: Consistent background and framing

## Component Patterns

- **PrimaryButton**: Big, playful, primary action
- **SecondaryButton**: Outlined or softer
- **StatPill**: Score, streak, rounds today
- **GameStageCard**: Wraps minigames; integrates with shell
- **NavTabs**: Icon + label, big tap targets

## Visual Acceptance Criteria (Non-Negotiable)

- No page has a "plain white document" look
- All main actions have big, playful buttons
- Tap targets ≥ 44×44px everywhere
- Consistent typography (no default browser look)
- Contrast + reduced-motion compliance
- Minigame integrates into shell (no styled island)
