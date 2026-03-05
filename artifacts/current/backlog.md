# Backlog — Epic 21.1: i18n Foundation + Dutch UI Copy

## Epic Summary
Create Dutch i18n infrastructure and replace all English UI strings with Dutch across the entire app.

## Scope In
- useI18n composable with interpolation support
- nl.json source of truth for all UI text
- Replace English strings in all 7 pages
- Replace English strings in all 20+ components
- Lint script to catch new hardcoded English
- Unit tests for useI18n
- Update E2E tests for Dutch text

## Scope Out
- Multi-locale support (nl only)
- vue-i18n package
- Backend/API i18n
- New UI layouts or features

## Risks
| Risk | Tag | Mitigation |
|------|-----|------------|
| E2E text selectors break | perf | Update Playwright selectors to use data-testid |
| Missing strings | - | Lint gate catches new English; thorough inventory done |
| Translation quality | - | Native review recommended post-MVP |

## NFRs
- Perf: nl.json statically imported, <5KB
- Security: no new data flows
- A11y: aria-labels translated to Dutch

## Tasks (priority order)
1. 0118-i18n-composable — Create useI18n + nl.json (W2)
2. 0119-i18n-pages — Replace English in all 7 pages (W1)
3. 0120-i18n-components — Replace English in all components (W1)
4. 0121-i18n-lint-gate — Add lint script for no-hardcoded English (I)
5. 0122-i18n-tests — Unit + E2E tests for i18n (T)
