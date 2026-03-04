# Epic 19 — Solution Design (Solution Designer)

## Approach

1. **Tokens first**: Update tokens.css and graphics.css with underwater palette. Remove white surfaces.
2. **Shell second**: Restyle AppShell, GameStageCard, NavTabs to use new tokens and add background patterns.
3. **Assets third**: Add 10+ underwater SVGs (fish, bubbles, seaweed, coral, shells, etc.) and background patterns.
4. **Pages fourth**: Ensure every page uses the shell; fix any hardcoded colors (e.g. play page skin picker, privacy footer).
5. **Polish fifth**: a11y audit, reduced motion, contrast check.

## Dependencies

- No API or DB changes
- No new npm packages required (use existing Vue/Nuxt + CSS)
- SVG assets can be simple shapes initially; can refine later

## Risks

- Contrast: dark backgrounds require light text; ensure WCAG AA
- Bundle size: 10+ SVGs must stay within budget
