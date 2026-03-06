# Epic 22: Game Feel

**Artifact:** `game-feel.md`  
**Author:** game-designer

---

## Design Goal

Each minigame should feel mechanically distinct within the first seconds of play while remaining kind, recoverable, and confidence-building.

## Contract v2 Feel Rules

- Every minigame declares one primary `interactionType`.
- Difficulty knobs are mechanic-specific (not copy-pasted generic knobs).
- Timeout never hard-fails a child; flow is hint then continue.
- Serving avoids same-feel repetition in short windows.

## Upgrade Targets and Knobs

| Minigame family | InteractionType | Example unique knobs |
|---|---|---|
| Build Bridge v2 | `drag-drop` | `dropZoneCount`, `decoyCount`, `snapTolerance` |
| Balloon Pop v2 | `timed-pop` | `spawnRate`, `graceSeconds`, `hintAtSeconds` |
| Submarine Sort v2 | `sort-into-bins` | `binCount`, `categoryOverlap`, `keyboardStepMode` |
| Train Builder v2 | `build-sequence` | `sequenceLength`, `decoyWagons`, `orderHints` |

## Progression

- Level 1: explicit guidance and low density.
- Mid levels: more options/decoys, same supportive tone.
- Higher levels: higher complexity, never punitive timeout.

## Serving Diversity

- Track recent `interactionType` and `layoutClass`.
- Penalize repeats in selection logic.
- Maintain at least 3 distinct interaction families in early-session rounds.
# Epic 22 - Game Feel and Mechanics (Minigame Contract v2)

## Purpose
Define how Epic 22 upgrades minigame interaction feel while keeping sessions varied, fair, and low-friction.  
This document is constrained to mechanics and player feel for Contract v2 delivery.

## Minigame Contract v2: Interaction Diversity

Contract v2 requires each minigame to expose distinct interaction verbs so players rotate between different cognitive and motor skills, not just different skins of the same action.

### v2 Interaction Principles

| Principle | Feel Goal | Product Rule |
|---|---|---|
| Distinct primary verb per minigame | Each game feels immediately different in first 3 seconds | No two active minigames share the same primary input pattern (drag-chain, timed-tap, route-draw, rhythm-match) |
| Secondary adaptation verb | Mid-session depth without complexity spike | Every minigame introduces one modifier behavior by level 2+ |
| Micro-feedback clarity | Inputs feel responsive and legible | Success/failure feedback in under 120ms visual response |
| Recoverable mistakes | "Try again" mood, not "you failed" mood | Soft fail states must convert into hint + retry, never hard eject |
| Session texture | Avoid monotony in 10-15 minute play windows | Serving logic must avoid repeating same mechanic family within recent window |

## Target Minigames (Upgraded Set of 4)

1. **Shape Sort Sprint** (drag-and-drop classification)  
2. **Number Stream Catch** (selective timed tapping)  
3. **Path Builder** (draw route under constraints)  
4. **Pattern Pulse** (rhythm/sequence matching)

## Mechanic Knobs by Minigame (Unique, Non-Generic)

These knobs are intentionally mechanic-specific and should be surfaced in tuning config (not hardcoded where possible).

| Minigame | Unique Knob | What It Controls | Player Feel Impact | Suggested Range |
|---|---|---|---|---|
| Shape Sort Sprint | `bucketOverlapRatio` | Spatial overlap between valid drop zones | Higher overlap increases ambiguity and careful aiming tension | 0.00-0.35 |
| Shape Sort Sprint | `decoySimilarityIndex` | Visual similarity of incorrect bins | Raises discrimination challenge without speed pressure | 0.10-0.80 |
| Shape Sort Sprint | `lateLockGraceMs` | Time window allowing near-deadline drop acceptance | Feels forgiving at timer edge | 120-450 ms |
| Number Stream Catch | `targetParitySwitchRate` | Frequency of odd/even (or rule) flips | Forces active rule tracking, reduces autopilot tapping | 0.05-0.30 flips/sec |
| Number Stream Catch | `tapCooldownPenaltyMs` | Cooldown after incorrect tap | Sets error cost without full punishment | 80-280 ms |
| Number Stream Catch | `streakBufferWindow` | Count of neutral taps before streak break | Allows minor slip without emotional reset | 1-3 neutral events |
| Path Builder | `junctionDensity` | Number of branch points per path | Increases planning load and route readability challenge | 2-9 junctions |
| Path Builder | `inkDriftFactor` | Amount of path wobble correction needed | Adds tactile control challenge (motor precision) | 0.00-0.25 |
| Path Builder | `checkpointSnapRadiusPx` | Distance for auto-snap to checkpoints | Balances precision with kindness | 8-28 px |
| Pattern Pulse | `syncToleranceMs` | Allowed hit timing around beat | Core rhythm strictness dial | +/-50 to +/-180 ms |
| Pattern Pulse | `ghostBeatOpacity` | Visibility of upcoming timing guides | Converts from memorization pressure to guided flow | 0.00-0.70 |
| Pattern Pulse | `patternMutationStep` | How much sequence changes each round | Controls novelty while preserving learnability | 1-4 symbol delta |

## Progression Across Levels (4 Upgraded Minigames)

Progression targets smooth escalation: complexity first, then speed/precision, while preserving recoverability.

| Minigame | Level 1 (Onboard) | Level 2 (Stretch) | Level 3 (Mastery) | Level 4 (Variety Endgame) |
|---|---|---|---|---|
| Shape Sort Sprint | Clear bins, low decoys, wide grace window | Introduce decoy similarity + mild overlap | Add moving bins and tighter late-lock grace | Mixed rounds: moving bins + temporary rule inversion prompts |
| Number Stream Catch | Stable target rule, slow stream | Rule flips begin, moderate stream velocity | Add distractor bursts and tighter cooldown recovery | Alternating rule packs with adaptive burst spacing |
| Path Builder | Low junction density, strong snap radius | Add optional checkpoints and dead-end branches | Increase junctions + introduce ink drift | Mixed map archetypes with rotating objective constraints |
| Pattern Pulse | High sync tolerance, visible guides | Longer patterns with mild mutation | Reduced tolerance + partial guide fade | Alternating tempo blocks + mutation bursts with safety hints |

## Timed-but-Kind Model (No Punishment)

Timers exist to maintain pacing and excitement, not to punish mistakes.

### Model Rules

| Event | System Response | Player-Facing Feel |
|---|---|---|
| Near timeout (final 20%) | Trigger contextual hint tied to current mechanic | "I got help right when I needed it" |
| Missed action once | Show micro-corrective cue; continue timer | "I can recover immediately" |
| Repeated misses in short window | Slow local challenge parameter (not full game speed) for one cycle | "Game adapts instead of scolding me" |
| Timer reaches zero | Convert to guided continuation state, preserve partial progress | "Round continues with assistance" |
| Post-guidance success | Restore normal tuning gradually over next 2-3 interactions | "Confidence rebuilds smoothly" |

### Hard Requirements

- No life loss, no score wipe, no forced restart from a single timeout.
- Any fail state must branch to `hint -> assisted attempt -> continue`.
- Assistance must be context-aware (showing *what to do next*), not generic ("Try harder").

## Anti-Repetition and Diversity: Serving Logic Implications

Serving logic should treat "interaction family" as first-class, not only minigame ID.

### Diversity Constraints

| Constraint | Why It Exists | Implementation Implication |
|---|---|---|
| Family cooldown | Prevent back-to-back same-feel tasks | Track last N mechanic families and apply temporary weight penalty |
| Minigame recency cap | Avoid exact-repeat fatigue | Do not serve same minigame inside recent window unless pool exhausted |
| Difficulty texture alternation | Avoid monotone tension curve | Alternate challenge vectors (speed -> precision -> logic) across rounds |
| Hint debt balancing | Prevent snowball frustration | If player received help recently, next served game should bias toward lower initial pressure |
| Novelty injection floor | Preserve freshness in long sessions | Guarantee at least one low-recency variant every M rounds |

### Recommended Serving Data Model Additions

- `mechanicFamily` (enum): `drag_sort`, `timed_tap`, `path_draw`, `rhythm_match`
- `recentServedFamilies[]`: ordered history window
- `recentServedMinigames[]`: ordered minigame IDs
- `assistanceEventsLast5`: count of hint/assist interventions
- `pressureProfile`: derived vector (`speed`, `precision`, `cognitive_switching`)

### Selection Heuristic (High-Level)

1. Filter by progression eligibility.  
2. Apply hard anti-repeat exclusions (same minigame recency).  
3. Reweight by family cooldown and pressure-profile alternation.  
4. If assistance debt is high, bias toward kinder opening knobs.  
5. Select highest weighted candidate with stochastic tie-break.

## Acceptance Signals for Feel Quality

| Signal | Target |
|---|---|
| Consecutive same-family serves in normal pool | 0 |
| Sessions with at least 3 distinct interaction families in first 6 rounds | >= 95% |
| Timeout events that end in hard fail | 0 |
| Assisted continuation success after hint | >= 70% |
| Player input-to-feedback latency (p95) | < 120 ms |

## Out of Scope (This Artifact)

- Art style, visual theming, or asset pipelines  
- Economy/reward balancing beyond feel impact  
- Backend schema migration details
