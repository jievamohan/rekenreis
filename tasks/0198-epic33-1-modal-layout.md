---
id: "0198"
title: "epic33-1-modal-layout"
status: "in_progress"
scope_in:
  - "apps/web/components/modals/LevelCompleteModal.vue"
  - "apps/web/pages/play.vue"
scope_out:
  - "apps/api"
lanes: ["W1", "T"]
gates: ["C", "D", "F"]
risk_tags: []
acceptance:
  - "Layout: sterren → titel → subtitle → Maatje → performance-bar → secundaire buttons → primair CTA → footer"
  - "Geen overlay-click, Escape of X om te sluiten"
  - "Button order: secundair (Bekijk foutjes, Nog een keer) → primair (VOLGENDE LEVEL / NAAR DE KAART)"
  - "Performance-bar: 'Super gedaan! X van de Y goed!'"
  - "Footer stats placeholders (scorePercent, timeFormatted, comboMax, xpGained)"
  - "E2E level-complete green"
---

# Epic 33.1 — Result Modal: Layout + Non-dismissable

## Goal

Herschik LevelCompleteModal naar screenshot-design; modal niet dismissable; performance-bar; footer placeholders; retry button.

## Implementation

1. Verwijder @click.self en Escape-close; behoud focus trap
2. Layout: sterren bovenaan → titel "Level Voltooid!" → subtitle "Je hebt X sterren verdiend!" → Maatje → performance-bar → secundaire buttons → primaire CTA → footer stats
3. Nieuwe props: correctCount, roundsTotal (voor performance), scorePercent, timeFormatted, comboMax, xpGained (placeholders in 33.1)
4. Nieuwe emit: retry (voor "Nog een keer")
5. Button order en styling per design
6. play.vue: pass correctCount, roundsTotal; handle retry; remove onModalClose usage
