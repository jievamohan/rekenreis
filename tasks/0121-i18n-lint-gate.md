---
id: "0121"
title: "Add lint script for no-hardcoded English"
epic: "21.1"
lane: I
gates: [C, D]
risk_tags: []
depends_on: ["0119", "0120"]
scope_in:
  - scripts/ci/check-i18n.sh
  - apps/web/package.json (add script)
scope_out:
  - ESLint plugin (too heavy; script-based check is sufficient)
  - CI workflow changes (add later if needed)
acceptance:
  - scripts/ci/check-i18n.sh exits 0 when no English strings found in pages/components
  - Script detects common English patterns in Vue templates
  - Script allows exceptions (data-testid values, CSS classes, imports, code identifiers)
  - pnpm run check:i18n script in package.json runs the check
  - Script runs successfully on current codebase (all strings translated)
---

# 0121 — Add lint script for no-hardcoded English

## What
Create a shell script that scans Vue templates for hardcoded English strings and flags violations.

## Implementation

### scripts/ci/check-i18n.sh
- Scan apps/web/pages/*.vue and apps/web/components/**/*.vue
- Look for common English words in template text content (not in script/style sections)
- Exclude: code identifiers, CSS classes, HTML attributes that aren't user-visible, data-testid, import paths, type annotations
- Focus on: text between > and <, aria-label values, title values, placeholder values
- Allow: Dutch text, t() calls, template expressions {{ }}, numbers
- Exit 0 if clean, exit 1 with list of violations

### apps/web/package.json
- Add script: "check:i18n": "bash ../../scripts/ci/check-i18n.sh"

## Acceptance
- [ ] Script detects English strings in templates
- [ ] Script passes on fully translated codebase
- [ ] Script is not overly noisy (few false positives)
