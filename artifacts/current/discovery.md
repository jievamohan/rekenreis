# Discovery — Epic 28: Replace Coral Minigame

## Business Context

Rekentreis is a math learning game for kleuters (4–6 jaar). Epic 27 introduced a coral reef minigame with drag-to-place mechanic. This creates a problem: we now have two drag-and-drop minigames (Treasure Dive + Coral Builder), reducing variety and making the experience repetitive for children.

## Problem Statement

1. **Duplicate mechanic:** Coral Builder and Treasure Dive both use drag-drop. Kids get the same interaction twice.
2. **Uniform layout:** All minigames share the same structure: progress bar → sum (ProblemCard) → answer choices. This feels monotonous.
3. **Lack of variety:** Children benefit from different gameplay patterns to stay engaged and to exercise different cognitive skills.

## User Goals

- Replace the coral-builder minigame with a **completely new** game
- **New gameplay:** A mechanic we don't yet have (not tap-choice, drag-drop, timed-pop, sort-into-bins)
- **Different look and feel:** Break the standard layout pattern; the new game should feel visually and structurally distinct
- **More variety:** Give kids a fresh experience that doesn't resemble other minigames

## Scope

- **In scope:** Replace MinigameCoralBuilder with a new minigame component; update registry, map, E2E
- **Out of scope:** Changing other minigames, new math operators, backend, i18n beyond Dutch

## Success Criteria

- New minigame uses an interaction type not yet in the pool (e.g. memory-flip, trace-numberline, build-sequence, swipe-match)
- Layout/visual structure differs from the standard "progressbar → sum → answers" pattern
- Kids experience genuine variety when the new minigame appears in rotation
