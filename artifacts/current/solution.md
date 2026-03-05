# Solution Design: Epic 21

## Route State Contract
```typescript
type NavigationPage = 'map' | 'play' | 'stickers' | 'summary' | 'settings' | 'home' | 'other'

interface NavigationState {
  currentPage: NavigationPage
  activeTab: NavigationPage | null
  canGoBackToMap: boolean
  isMapPage: boolean
  isPlayPage: boolean
  currentLevelId: number | null
}
```

## UI Visibility Matrix
| Element | /map | /play | /stickers | /summary | /settings |
|---------|------|-------|-----------|----------|-----------|
| NavTabs | yes (map=current) | yes | yes (stickers=current) | yes | yes |
| Back to Map btn | hidden | visible | visible | visible | visible |
| Choose Level header | visible | hidden | hidden | hidden | hidden |
| Stars total | visible | hidden | hidden | hidden | hidden |
| Play current CTA | visible | hidden | hidden | hidden | hidden |
| Game HUD | hidden | visible | hidden | hidden | hidden |
| Exit to Map btn | hidden | visible | hidden | hidden | hidden |

## Implementation Order
1. Types + composable (no UI changes)
2. AppShell refactor (visibility rules)
3. Page updates (remove ad-hoc, add missing elements)
4. Flow wiring (complete cycle)
5. E2E tests
