# Art Direction — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** art-director

## Visuele versterking

### Kist
- Huidig: dashed border, emoji icoon
- **Voorstel:** Kist als duidelijk drop-doel; grotere hitbox; bij correcte drop: korte open-animatie; bij wrong: subtiele shake
- Kleuren: blijf binnen `--app-correct`, `--app-wrong`, `--app-primary`

### Edelstenen
- Huidig: ronde rechthoeken met gradient
- **Voorstel:** Subtiele float (translateY) zolang ze in pool zitten; bij drag: scale-up, cursor grabbing
- Geen realistische textuur; plat, chunky, kid-friendly

### Omgeving
- Licht "zeebodem"-effect onder kist: donkere gradient of lichte strook
- Optioneel: kleine bubbles als decoratie (CSS only)
- Tap targets ≥ 48px

### Motion
- Correct drop: chest "opent" (scale/transform) ≤ 300ms
- Wrong drop: gem bounce-back, chest wobble ≤ 300ms
- Float: 2–3s loop, ease-in-out
- `prefers-reduced-motion: reduce` → alle animaties uit
