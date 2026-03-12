const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_PATHS.some((p) => to.path.startsWith(p) || to.path === p)) {
    return
  }

  if (import.meta.server) {
    return
  }

  const { user, fetchAuthUser } = useAuth()

  if (!user.value) {
    await fetchAuthUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
