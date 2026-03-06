# Discovery — Treasure Dive Creatiever

**Run ID:** treasure-dive-creative-2025-03  
**Agent:** business-analyst

## Problem Statement

De speler bevindt zich op level 14 en ervaart Treasure Dive als "een van de drie antwoorden aanklikken" — het voelt hetzelfde als andere minigames in het spel. De interactie lijkt generiek en niet creatief genoeg.

## Context

- **Level 14** → Treasure Dive (minigame-map.v1.json)
- **Huidige mechanic:** Edelstenen met getallen; sleep de juiste naar een kist OF klik edelsteen + klik kist
- **Perceptie:** De click-select flow domineert; veel spelers gebruiken die in plaats van drag, waardoor het identiek aanvoelt aan bubble-pop, fish-feed, coral-builder (allemaal "kies 1 van N")
- **Doelgroep:** Kleuters 4–6, Nederlandstalig

## Scope

- **In scope:** Treasure Dive visueel en interactioneel onderscheidend maken
- **Out of scope:** Andere minigames aanpassen; nieuwe minigames toevoegen; level-mapping wijzigen; API/backend wijzigingen

## Success Criteria

- Treasure Dive voelt **anders** dan de overige tap-choice minigames
- De onderwater/schat-thema wordt **versterkt** via visuele en interactionele feedback
- Bestaande functionaliteit (keyboard, a11y, drag-drop) blijft werken
- Bundle budget en diversity gate blijven passeren

## Constraints

- Minigame contract v2 (interactionType: drag-drop) behouden
- Geen breaking changes voor E2E/Playwright
- Dutch copy via useI18n
