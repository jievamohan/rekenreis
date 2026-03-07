# Discovery — Fish Feed (Level 15) Creatiever

**Run ID:** fish-feed-creative-2025-03  
**Agent:** business-analyst

## Problem Statement

De speler bevindt zich op level 15 en ervaart Fish Feed als "weer hetzelfde" — een timerbalk bovenaan, een rij knoppen met getallen, en een vis-emoji. De layout en gameplay lijken te veel op Bubble Pop, Treasure Dive en andere minigames. Het voelt niet creatief of onderscheidend.

## Context

- **Level 15** → Fish Feed (minigame-map.v1.json)
- **Huidige mechanic:** Timer bar + vis emoji + horizontale rij pellets (knoppen met nummers)
- **Perceptie:** "1 van 3/4 aanklikken" — identiek aan Bubble Pop (bubbels), Coral Builder (stukken), Starfish Match (paren)
- **Doelgroep:** Kleuters 4–7, Nederlandstalig
- **Uniek aspect:** Fish Feed is het **timed** minigame — maar de timer is een generieke balk bovenaan

## Scope

- **In scope:** Fish Feed visueel en interactioneel onderscheidend maken; layout en gameplay creatiever
- **Out of scope:** Andere minigames aanpassen; level-mapping wijzigen; API/backend; nieuwe minigames toevoegen

## Success Criteria

- Fish Feed voelt **anders** dan de overige tap-choice minigames
- De onderwater/vis-voeren-thema wordt **versterkt** via layout en visuele feedback
- Timer visueel geïntegreerd in de scene (niet "weer een balk bovenaan")
- Bestaande functionaliteit (keyboard, a11y, hint-continue bij timeout) blijft werken
- Bundle budget en diversity gate blijven passeren

## Constraints

- Minigame contract v2 (interactionType: timed-pop) behouden
- Geen breaking changes voor E2E/Playwright
- Dutch copy via useI18n
- Kid-safe timer: timeout blijft hint + continue, geen fail state
