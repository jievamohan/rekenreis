# Game Feel — Fish Feed Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Agent:** game-designer

## Mechanic Identiteit

Fish Feed moet **uniek** aanvoelen ten opzichte van:
- Bubble Pop (tap floating bubbles, timed)
- Treasure Dive (drag gems to chest)
- Fish Feed (tap pellets, timed) ← **dit zelf**
- Coral Builder (tap pieces on track)
- Submarine Sort (drag to bins)
- Starfish Match (tap pairs, timed)

## Huidige Problemen

1. **Layout:** Timer bar + rij knoppen — identiek aan Bubble Pop
2. **Timer:** Generieke balk bovenaan — voelt niet thematisch
3. **Pellets:** Statische rij knoppen — geen "voeren"-gevoel
4. **Vis:** Emoji 1x — visueel zwak

## Creatieve Versterkingen

### 1. Timer in de scene

- **Huidig:** Horizontale balk bovenaan
- **Voorstel:** Timer visueel in de scene:
  - Optie A: Waterniveau dat daalt (aquarium)
  - Optie B: Zandloper in het water
  - Optie C: Vis die "hongeriger" wordt (subtiele visuele cue)
  - Optie D: Bubbels die langzaam verdwijnen
- **Niet:** Timer verwijderen; moet blijven voor timed-kind

### 2. Pellets als "voer"

- **Huidig:** Rij knoppen onderaan
- **Voorstel:**
  - Pellets zweven/drijven in het water (als voedsel)
  - Of: pellets vallen van boven naar beneden
  - Tap = pellet "vliegt" naar de vis
  - Correct: vis eet het pellet
  - Wrong: pellet valt terug / vis schudt hoofd

### 3. Vis als centraal element

- **Huidig:** Emoji 1x
- **Voorstel:**
  - Vis groter en centraal
  - Wacht op voer: vis zwemt rustig
  - Bij correct: vis "eet" (korte animatie)
  - Bij wrong: vis schudt zacht
  - Bij timeout: vis kijkt naar hint (niet straf)

### 4. Layout-differentiatie

- **Huidig:** Verticaal: timer | vis | pellets
- **Voorstel:**
  - Aquarium-frame: scene als "doos" met water
  - Pellets verspreid in het water (niet in een rij)
  - Vis centraal, pellets eromheen
  - Of: pellets vallen van boven, vis onderaan

## Risico's

- Te veel animatie → afleiding of motion sensitivity
- Mitigatie: Reduced motion respecteren; alle animaties ≤ 400ms
- Budget: geen zware assets; CSS/SVG-first
