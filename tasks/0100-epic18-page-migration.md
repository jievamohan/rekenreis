---
id: "0100"
title: "epic18-page-migration"
owner: "orchestrator"
status: "done"
scope_in:
  - "Migrate index, start, play, stickers, summary, settings to AppShell + tokens"
  - "Replace ad-hoc styles with token-based classes"
  - "Ensure no plain white backgrounds on any page"
  - "Play page: game area inside GameStageCard; minigame integrates (no styled island)"
  - "Consistent typography, big buttons, 44px tap targets"
  - "Preserve contrast + reduced-motion compliance"
scope_out:
  - "E2E/smoke updates (task 0101)"
acceptance:
  - "No page has plain white document look"
  - "All main actions have big, playful buttons"
  - "Tap targets >= 44px everywhere"
  - "Typography consistent (no default browser look)"
  - "Minigame styling integrates into shell"
  - "Typecheck passes, build succeeds"
lanes:
  - name: "W1"
    files: ["apps/web/pages/*.vue"]
gates: ["C", "D", "F"]
risks: []
---

## Context

Epic 18 Task 4. Migrate all pages to unified kid-friendly shell and tokens.
