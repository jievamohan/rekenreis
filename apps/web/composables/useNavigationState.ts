import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationPage, NavTab, NavigationState } from '~/types/navigation'

const PATH_TO_PAGE: Record<string, NavigationPage> = {
  '/map': 'map',
  '/play': 'play',
  '/stickers': 'stickers',
  '/summary': 'summary',
  '/settings': 'settings',
  '/': 'home',
  '/start': 'start',
}

const PAGE_TO_TAB: Partial<Record<NavigationPage, NavTab>> = {
  map: 'map',
  stickers: 'stickers',
  summary: 'summary',
  settings: 'settings',
}

export function useNavigationState(): NavigationState {
  const route = useRoute()

  const currentPage = computed<NavigationPage>(() => {
    return PATH_TO_PAGE[route.path] ?? 'other'
  })

  const activeTab = computed<NavTab | null>(() => {
    return PAGE_TO_TAB[currentPage.value] ?? null
  })

  const canGoBackToMap = computed(() => currentPage.value !== 'map')

  const isMapPage = computed(() => currentPage.value === 'map')

  const isPlayPage = computed(() => currentPage.value === 'play')

  const currentLevelId = computed<number | null>(() => {
    if (currentPage.value !== 'play') return null
    const q = route.query.level
    if (typeof q === 'string') {
      const n = Number(q)
      return Number.isFinite(n) && n > 0 ? n : null
    }
    return null
  })

  return reactive({
    currentPage,
    activeTab,
    canGoBackToMap,
    isMapPage,
    isPlayPage,
    currentLevelId,
  })
}
