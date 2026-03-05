# Epic 21.3 — Game Feel

**Source:** docs/design/epic-21.md

## Bubble Pop

- **Float animation:** Bubbles translateY loop (2–3s); linear easing
- **Pop on tap:** Scale + opacity ≤ 300ms, ease-out
- **Feedback:** Correct → celebrate; wrong → gentle retry/hint

## Treasure Dive

- **Drag scale-up:** Gem scales to 1.05 on drag start; ≤ 200ms ease-out
- **Chest open:** Chest opens when gem enters hitbox; ≤ 300ms ease-out
- **Feedback:** Correct → celebrate; wrong → gentle retry/hint

## General

- No punitive fail states
- Hints always available
- CSS-only; no JS animation libraries
