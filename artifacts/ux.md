# Epic 1: Level Contract + Content Pack — UX

## Primary user flow(s)

1. **Infinite mode (unchanged)**  
   - User visits /play (or /play?mode=infinite).  
   - Questions generated on-the-fly.  
   - Answer → feedback → Next → repeat.

2. **Content pack mode**  
   - User visits /play?mode=pack (or configured default).  
   - Questions served from levels.v1.json in order (or deterministic shuffle).  
   - Same flow: answer → feedback → Next → repeat.

## Screen/page list

- **/play** (unchanged visually). Same UI: question, choices, score, streak, feedback, Next.  
- Optional: minimal mode indicator (e.g. "Practice" vs "Levels")—out of scope for Epic 1 if not required; keep minimal.

## Interaction model

- **Loading**: Same as today; no spinner needed if pack loads instantly (static import).  
- **Success**: Questions render; user answers, gets feedback.  
- **Error**: If pack fails to load in pack mode → fallback to infinite mode silently, or show brief message.

## A11y notes

- No change: existing keyboard, focus, ARIA from Epic 0 remain.

## Minimal microcopy

- No new labels required. If mode toggle added later: "Practice" / "Levels".

## UI edge cases

- Empty pack: fallback to infinite mode.  
- Invalid mode param: treat as infinite (safe default).
