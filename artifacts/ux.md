# Epic 10 — Child Profiles: UX

## Principles

- Large tap targets (min 44px)
- Minimal reading; icons where possible
- Kid-friendly avatars (simple shapes or emoji)

## Profile Selector

- List of profiles as cards with avatar + name
- Tap to select (switch profile)
- "Add profile" button
- On first visit: prompt to create profile or use default

## Profile Creation

- Name field (short, optional default "Player 1")
- Avatar picker: 4–6 simple options (e.g. shapes: star, heart, circle, square)
- Create button

## Parent Gate

- Settings access: "Hold for 3 seconds" OR "Solve: 3 + 4 = ?"
- Once passed: session cookie/sessionStorage; expires on close or 5 min
- Must not block gameplay; only settings

## Settings (behind gate)

- Difficulty: up to 10 / up to 20
- Hints: on / off
- Per profile
