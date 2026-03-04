# Epic 18 — Security Design

## Risk Assessment

- **No auth changes**: Profile/parent gate unchanged
- **No new data flows**: Frontend-only styling
- **No new dependencies**: CSS/tokens only; optional icon font (e.g. inline SVG)
- **No secrets**: Design tokens are public styling

## Mitigations

- Use only CSS variables and existing assets
- No external CDN for fonts unless already in use (prefer system or bundled)
- SAST/semgrep: no new patterns; existing rules apply
- Gitleaks: no secrets in new files

## Compliance

- Contrast: maintain WCAG AA where applicable
- Reduced motion: respect `prefers-reduced-motion` (already in use for graphics)
