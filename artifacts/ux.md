# Epic 16 — Release Prep: UX

## Principles

- Kid-friendly: large tap targets, clear feedback, no punitive states
- Parent-friendly: settings, summary, privacy notes
- Accessible: contrast, reduced motion, keyboard playable

## UX Pass (Epic 16)

### Tap targets (0080 — done)
- All interactive elements ≥ 44×44px (WCAG 2.5.5)
- play.vue: skin-btn, choose-game-btn, close-btn, rewards-link, settings-link
- SkinClassic radios, stickers, summary, settings pages
- ModeBuildBridge planks and drop zone

### Color/contrast (0081 — done)
- Text/background 4.5:1 (normal), 3:1 (large)
- prefers-reduced-motion for animations in all skins and modes

### Copy pass (0082 — done)
- Index/start: welcoming, kid-friendly
- Summary: parent-friendly labels
- Settings: clear labels for difficulty, hints, sound
- Privacy note: friendly

## Verification

- Re-run audit on key pages
- Confirm no regressions
