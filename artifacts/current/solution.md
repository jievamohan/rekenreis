# Solution — Fish Feed Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Agent:** solution-designer

## Aanpak

1. **Layout:** Aquarium-scene met vis centraal
2. **Timer:** In-scene: waterniveau dat daalt OF zandloper in hoek
3. **Pellets:** Verspreid in het water (niet horizontale rij)
4. **Feedback:** CSS-animaties voor correct/wrong

## Technische Keuzes

- **CSS-first:** Geen nieuwe assets; CSS/SVG voor waterniveau of zandloper
- **Timer visueel:** Waterniveau in aquarium: `height` of `clip-path` op basis van `timerFraction`
- **Pellets:** `position: absolute` of flex met random-ish offsets; seeded voor determinisme
- **Vis:** Emoji of grotere SVG; animatie bij correct

## Ops/Config

- N/A: geen config wijzigingen
