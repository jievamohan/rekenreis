/**
 * Composable for AppShell coordination.
 * Play page registers a custom "Choose game" handler (opens mode selector).
 * Other pages use default: navigate to /play.
 */
const chooseGameHandler = ref<(() => void) | null>(null)

export function useAppShell() {
  function setChooseGameHandler(fn: (() => void) | null) {
    chooseGameHandler.value = fn
  }

  function getChooseGameHandler() {
    return chooseGameHandler.value
  }

  return { setChooseGameHandler, getChooseGameHandler }
}
