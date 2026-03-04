# Bug Bash Checklist (Release Prep)

Manual verification steps for release-quality UX and stability. Run with stack up (`docker compose up` or `scripts/bug-bash/start.sh`).

## Prerequisites

- Stack running: `docker compose up --build` or `scripts/bug-bash/start.sh`
- Web: http://localhost:3000
- API: http://localhost:8001

## Play Flows

- [ ] **Home**: Visit `/` — Welcome message, links to Check connection and Play math game
- [ ] **Start**: Visit `/start` — API health JSON or connection status
- [ ] **Play (classic)**: Visit `/play` — Math question, answer buttons, feedback on correct/wrong
- [ ] **Play (timed-pop)**: Switch to Timed Pop — Timer visible, timeout works, Next loads new question
- [ ] **Play (build-bridge)**: Switch to Build Bridge — Bridge visual, drag/click plank to slot, feedback
- [ ] **Modes**: Choose game → select each mode → game switches correctly
- [ ] **Skins**: Skin buttons (classic, monster-feed, etc.) — switch works; locked skins show lock
- [ ] **Next**: After feedback, click Next — new question loads, score increments

## Profiles & Settings

- [ ] **Profile selector**: Click profile name → overlay opens, switch profile works
- [ ] **Create profile**: Add new profile → name/avatar, appears in list
- [ ] **Settings**: Visit `/settings` — Parent gate (hold 3s or solve sum), then difficulty/hints/sound
- [ ] **Difficulty**: Change Up to 10 / Up to 20 — persists, affects questions

## Stickers & Summary

- [ ] **Sticker book**: Visit `/stickers` — Categories, locked/unlocked stickers, back to game
- [ ] **Progress summary**: Visit `/summary` — Rounds, accuracy, favorite mode
- [ ] **Copy**: Copy to clipboard — JSON in clipboard, no personal data
- [ ] **Save as file**: Download — JSON file downloads

## Accessibility

- [ ] **Keyboard**: Tab through play page — focus visible, Enter/Space activate buttons
- [ ] **Tap targets**: All buttons/links at least 44×44px (easy to tap on touch device)
- [ ] **Reduced motion**: System prefers-reduced-motion — no bounce/shake on feedback

## Smoke (Quick Pass)

1. `/` → `/play` → answer question → Next → new question
2. Switch to Build Bridge → complete one round
3. `/stickers` → back
4. `/summary` → Copy to clipboard
