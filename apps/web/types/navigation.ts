/** Pages the app knows about for navigation/visibility decisions. */
export type NavigationPage =
  | 'map'
  | 'play'
  | 'stickers'
  | 'summary'
  | 'settings'
  | 'home'
  | 'start'
  | 'other'

/** Tab-navigable pages shown in NavTabs. */
export type NavTab = 'map' | 'stickers' | 'summary' | 'settings'

/** Centralized navigation state derived from the current route. */
export interface NavigationState {
  /** Which known page is currently active. */
  currentPage: NavigationPage
  /** Which NavTab corresponds to the current page (null if none). */
  activeTab: NavTab | null
  /** True on every page except /map — drives "Back to Map" visibility. */
  canGoBackToMap: boolean
  /** Convenience flags for page-specific UI gating. */
  isMapPage: boolean
  isPlayPage: boolean
  /** Level ID parsed from ?level= query on /play; null otherwise. */
  currentLevelId: number | null
}
