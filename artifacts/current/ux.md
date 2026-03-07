# UX — Fish Feed Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Agent:** ux-designer

## Huidige UX

- Timer bar boven
- Vis emoji midden
- Pellets horizontale rij onder
- Hint overlay bij timeout

## Doel-UX

- **Layout:** Aquarium-scene: vis centraal, pellets eromheen
- **Timer:** Geïntegreerd in scene (waterniveau, zandloper of subtiele cue)
- **Feedback:** Tap correct → pellet vliegt naar vis, vis "eet"
- **Wrong:** Pellet terug, vis schudt zacht
- **Timeout:** Hint blijft vriendelijk; continue zonder straf

## Interactie

- **Tap:** Pellet selecteren (zelfde als nu)
- **Keyboard:** Tab + Enter/Space (zelfde als nu)
- **Timer:** Geen wijziging in logica; alleen visuele presentatie

## Toegankelijkheid

- Grote tap targets (min 48px)
- Focus visible op alle targets
- aria-label voor timer, pellets, vis
- Reduced motion: animaties uit bij prefers-reduced-motion

## Dutch Copy

- Bestaande strings blijven; eventueel nieuwe voor pellet-feedback
- "Korrel {value}" blijft
- Hint message blijft
