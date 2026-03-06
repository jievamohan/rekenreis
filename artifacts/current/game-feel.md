# Game Feel — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** game-designer

## Mechanic Identiteit

Treasure Dive moet **uniek** aanvoelen ten opzichte van:
- Bubble Pop (tap floating bubbles)
- Fish Feed (tap pellets, timed)
- Coral Builder (tap pieces on track)
- Submarine Sort (drag to bins)
- Starfish Match (tap pairs, timed)

## Versterkingen

### 1. Echte drag-drop sensatie
- **Huidig:** Drag werkt, maar click-select is sneller en domineert
- **Voorstel:** Drag visueel en haptisch aantrekkelijker; edelsteen volgt cursor met parallax/bounce; kist "zuigt" bij hover
- **Niet:** Click-select verwijderen (a11y/keyboard vereist)

### 2. Kist als levend object
- **Huidig:** Statische kist met dashed border
- **Voorstel:** Kist opent licht bij correcte drop; schittering; wrong drop → kist schudt, edelsteen keert terug
- **Epic 21 design:** Chest open/close ≤ 300ms

### 3. Onderwater-omgeving
- **Huidig:** Vlakke zones met lichte gradient
- **Voorstel:** Edelstenen zweven met subtiele float; kist op "zeebodem"-strook; bubbles of zandkorrels als ambient
- **Budget:** Bestaande tokens; geen zware assets

### 4. Juiste drop = voldoening
- Edelsteen "valt" in kist; kist sluit; korte gloed; direct volgende vraag
- Wrong: edelsteen springt terug naar pool; kist pulseert rood-oranje; speler kan direct opnieuw proberen

## Risico's

- Te veel animatie → afleiding of motion sensitivity
- Mitigatie: Reduced motion respecteren; alle animaties ≤ 400ms
