# Epic 22: Motion & Audio Rules

**Artifact:** `motion-audio.md`  
**Author:** motion-audio-designer

---

## Motion Principles

- Motion communicates guidance, never punishment.
- Timer urgency is local and calm, not full-screen stress.
- Timeout transitions are soft and supportive.

## Timer Motion Rules

- Use compact timer bars/rings with gentle easing.
- Near timeout may show a subtle cue.
- On timeout: fade to hint state, keep progress, continue flow.
- Never shake, flash, or show fail splash for timeout.

## Reduced Motion

- Respect `prefers-reduced-motion` on all minigames.
- Replace animated cues with static text/icon/state changes.
- Disable non-essential celebratory effects in timed contexts.

## Audio Policy

- Audio remains optional and user-controllable.
- No alarm-like timeout sounds.
- Hint/continue cues are gentle and non-startling.

## QA Checklist

- Timeout path remains non-punitive in all timed games.
- Reduced motion keeps gameplay fully understandable.
- Muted audio does not remove required gameplay information.
# Epic 22 - Motion and Audio Policy (Minigame Mechanics Overhaul)

## Purpose

Define motion and audio behavior for Epic 22 minigames so feedback is clear, supportive, and accessibility-first. This policy applies to all upgraded mechanics and must be implemented with a calm, non-punitive feel.

## Scope

- In scope: motion transitions, timer-related motion, reduced-motion substitutions, timeout/hint behavior, and audio cue policy.
- Out of scope: visual art asset creation, soundtrack composition, backend telemetry schema.

## Core Experience Principles

- Motion communicates state and guidance, never punishment.
- Timer pressure is informational, not stressful.
- Timeout and hint states should feel like coaching, not failure.
- Audio is assistive, optional, and comfortable at child-safe levels.
- All core interactions remain fully understandable with reduced motion and muted audio.

## Timer-Related Motion Guidance

### Global timer behavior

- Use local, low-amplitude timer indicators (ring depletion, progress bar easing, subtle highlight pulse).
- Avoid full-screen urgency effects (camera shake, flashing backgrounds, aggressive zooms, rapid color strobing).
- Timer updates should be smooth and consistent; no abrupt jumps unless explicitly tied to a game event.
- Reserve urgency accent changes for final 20% of available time, and keep them visually calm.

### Timer transition constraints

- Preferred duration for timer state transitions: 120-220ms.
- Easing should be gentle (`ease-out`/equivalent), not elastic/bouncy.
- At timeout, transition to assist/hint state with soft fade and focus shift (no hard cut to failure screen).
- Never combine timer expiration with negative motion patterns (shake, slam, flash burst).

## Reduced Motion Requirements by Mechanic

All mechanics must support reduced motion mode with equivalent clarity and no gameplay disadvantage.

### Drag/Sort mechanics

- Replace lift/fly/bounce with static state swap:
  - focused item outline + contrast boost
  - valid target highlight ring
  - success icon badge (check)
- Invalid placement uses color/outline swap only; no shake animation.

### Timed tap/catch mechanics

- Replace expanding/contracting pulse with static countdown ring segments or numeric countdown.
- Expiration state uses desaturation + icon change, not pop/explode animation.
- Hit confirmation is a short opacity flash or icon swap, not particle burst.

### Path/draw mechanics

- Replace animated trail flourishes with persistent stroke color changes.
- Checkpoint confirmation uses static marker fill + icon, not bounce or ripple.
- Error correction cues remain local to the affected segment; no board-wide movement.

### Pattern/rhythm mechanics

- Replace beat bounce with fixed lane/slot highlights and step indicators.
- Timing windows are shown using static bars/rings plus optional text cue.
- Miss feedback is a subtle state change only; no jitter or flashing.

### Reduced motion non-negotiables

- No rapid flashing.
- No screen shake.
- No forced continuous motion loops for core readability.
- All instructional cues must still be available through static UI states.

## Timeout and Hint Transition Policy

Timeout and hint systems must de-escalate stress and preserve momentum.

- On near-timeout (final 20%), show one contextual hint with calm entrance transition.
- On timeout, route to guided continuation state:
  - preserve partial progress
  - surface next-best action
  - allow immediate retry flow without punitive reset
- Hint transitions should be soft fade/slide (small distance), max 250ms, single pass.
- Do not use red-error takeover screens, loss stingers, or fail splashes.
- Language and visuals must be supportive ("Try this next") rather than judgmental ("Wrong"/"Failed").

## Audio Cue Policy

### Optional and user-controlled

- Gameplay audio cues must be optional and separately controllable from master music.
- Support at minimum:
  - master mute
  - SFX mute
  - music mute (if music exists)
- The minigame loop remains fully playable and comprehensible with all audio disabled.

### Cue design constraints

- Use short, soft-envelope cues; avoid sharp transients and startling attack peaks.
- Avoid punitive sounds for errors/timeouts (no buzzers/alarms/sudden low-frequency hits).
- Prefer positive/recovery-oriented cues for hints, assists, and successful corrections.
- Keep dynamic range narrow and consistent between cues to avoid sudden volume jumps.

### Timer and timeout audio guidance

- Optional low-intensity timer cue can be used near final 20% only.
- If present, timer cue cadence must not accelerate into panic patterns.
- Timeout event should use neutral-to-supportive cue only, paired with hint/assist reveal.
- Any repeated cue must be rate-limited to prevent fatigue.

## Implementation Guardrails

- Reuse existing motion/audio systems and tokens where possible; avoid heavy new dependencies.
- Keep all behavior behind accessibility/user-preference checks.
- Ensure default and reduced-motion paths are both covered by component-level tests where feasible.
- If a cue is not critical for comprehension, it should be suppressible.

## QA Acceptance Checklist

Use this checklist for Epic 22 motion/audio sign-off.

### Timer and motion

- [ ] Timer indicators are local and calm; no full-screen urgency effects.
- [ ] Final-20%-time behavior is informative and not visually aggressive.
- [ ] Timeout transition leads to guided continuation, not hard fail reset.
- [ ] No punitive motion patterns (shake/slam/flash burst) are triggered on misses or timeout.

### Reduced motion by mechanic

- [ ] Drag/Sort is fully understandable with static cues only.
- [ ] Timed tap/catch communicates timing windows without pulsing/burst effects.
- [ ] Path/draw feedback works without animated trails or board movement.
- [ ] Pattern/rhythm steps are readable without beat bounce/jitter.
- [ ] Reduced-motion mode has no rapid flashing and no screen shake.

### Timeout/hint behavior

- [ ] Near-timeout hint appears contextually and calmly.
- [ ] Timeout preserves progress and offers immediate assisted continuation.
- [ ] Hint/assist transitions are soft and non-judgmental in tone and copy.
- [ ] No punitive messaging, stingers, or fail splash screens are present.

### Audio

- [ ] SFX cues are optional and can be muted independently.
- [ ] Gameplay remains fully understandable with all audio muted.
- [ ] Cues are non-startling (no harsh attack peaks or alarm-like patterns).
- [ ] Error/timeout cues are neutral-supportive, not punitive.
- [ ] Repeating cues are rate-limited and do not create fatigue.

## Sign-off Criteria

This artifact is PASS when:

- Every checklist item above is verified in QA for all Epic 22 mechanics.
- Reduced-motion and muted-audio playthroughs are both viable without loss of core comprehension.
- No punitive motion/audio behavior is observed in timeout or error pathways.
