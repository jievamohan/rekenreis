# Asset Manifest — Epic 21

**Role:** illustrator  
**Epic:** 21 — Six New Minigames  
**Constraint:** SVG only, each < 2KB, total new assets < 80KB (target < 40KB for this manifest)

---

## Asset Manifest by Minigame

### Bubble Pop
| Asset | Purpose |
|-------|---------|
| bubble.svg | Floating bubble, tappable |
| bubble-pop.svg | Burst state (optional; can be CSS-only) |

### Treasure Dive
| Asset | Purpose |
|-------|---------|
| gem-red.svg | Red gem, draggable |
| gem-blue.svg | Blue gem, draggable |
| shell.svg | Shell, draggable |
| treasure-chest.svg | Chest (open/close states via CSS or variants) |

### Fish Feed
| Asset | Purpose |
|-------|---------|
| fish-hungry.svg | Fish awaiting pellet |
| pellet.svg | Droppable pellet |
| fish-fed.svg | Fish after successful feed |

### Coral Builder
| Asset | Purpose |
|-------|---------|
| coral-piece-1.svg | Coral piece variant 1 |
| coral-piece-2.svg | Coral piece variant 2 |
| coral-piece-3.svg | Coral piece variant 3 |
| reef-base.svg | Base reef structure |

### Submarine Sort
| Asset | Purpose |
|-------|---------|
| submarine.svg | Submarine body |
| compartment.svg | Sort compartment/slot |
| sort-item.svg | Generic sortable item |

### Starfish Match
| Asset | Purpose |
|-------|---------|
| starfish.svg | Default starfish |
| starfish-matched.svg | Matched state |
| connection-line.svg | Line between matched pair |

---

## Shared Assets

| Asset | Purpose |
|-------|---------|
| minigame-bg-scene.svg | Reusable underwater scene background |

---

## Totals

- **Per-minigame SVGs:** ~19
- **Shared:** 1
- **Total:** ~20 SVGs
- **Size budget:** Each < 2KB, total < 40KB

---

## Directory Structure

```
assets/graphics/minigames/
├── bubble-pop/
│   ├── bubble.svg
│   └── bubble-pop.svg
├── treasure-dive/
│   ├── gem-red.svg
│   ├── gem-blue.svg
│   ├── shell.svg
│   └── treasure-chest.svg
├── fish-feed/
│   ├── fish-hungry.svg
│   ├── pellet.svg
│   └── fish-fed.svg
├── coral-builder/
│   ├── coral-piece-1.svg
│   ├── coral-piece-2.svg
│   ├── coral-piece-3.svg
│   └── reef-base.svg
├── submarine-sort/
│   ├── submarine.svg
│   ├── compartment.svg
│   └── sort-item.svg
├── starfish-match/
│   ├── starfish.svg
│   ├── starfish-matched.svg
│   └── connection-line.svg
└── shared/
    └── minigame-bg-scene.svg
```

---

## Style Guidelines

- **Aesthetic:** Flat, rounded, bright colors
- **Palette:** Underwater theme — blues, teals, corals, sandy tones
- **Consistency:** Match existing assets in `assets/graphics/`

---

## Placeholder Policy (v1)

- Simple geometric shapes with correct dimensions are acceptable for initial implementation
- Placeholders must respect size budget (< 2KB each)
- Replace with final art in later iteration without changing component APIs
