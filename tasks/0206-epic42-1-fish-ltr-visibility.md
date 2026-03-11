---
id: 0206-epic42-1-fish-ltr-visibility
title: L→R Fish Visibility Fix
scope_in:
  - L→R zwemmende visjes zijn zichtbaar in Fish Feed minigame
  - Beide richtingen (L→R en R→L) even goed zichtbaar
scope_out: []
lanes: [W1]
file_globs: [apps/web/components/minigames/MinigameFishFeed.vue]
gates: [C, F]
risk_tags: []
acceptance:
  - L→R visjes zichtbaar tijdens hun zwemroute
  - R→L visjes blijven zichtbaar
  - Geen regressie op Fish Feed gedrag
---

# Epic 42.1 — L→R Fish Visibility Fix

De vissen die van links naar rechts zwemmen, zijn niet zichtbaar. Dit moet opgelost worden.
