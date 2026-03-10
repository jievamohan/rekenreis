# Backlog — Epic 33.1: Result Modal Layout + Non-dismissable

**PlanRef:** docs/design/epic-33.md, slice 33.1

## Scope In
- LevelCompleteModal.vue layout herschikken (sterren → titel → subtitle → Maatje → performance-bar → buttons → footer)
- Modal niet dismissable (geen overlay-click, Escape, X)
- Button order: secundair (Bekijk foutjes, Nog een keer) → primair (VOLGENDE LEVEL / NAAR DE KAART)
- Performance-bar met placeholder tekst
- Footer stats placeholders (scorePercent, timeFormatted, comboMax, xpGained — kunnen 0/placeholder)
- Retry button ("Nog een keer") op modal

## Scope Out
- Timer/combo/XP data wiring (Epic 33.2)
- i18n uitgebreide keys (Epic 33.3)
- Styling fine-tune (Epic 33.3)

## Risks
- Geen

## Gates
- C: typecheck
- D: secrets/SAST
- F: bundle budget

## Tasks
1. 0198-epic33-1-modal-layout — Layout + non-dismissable + retry
