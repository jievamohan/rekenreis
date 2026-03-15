import type { AuthUser } from '~/utils/api'
import {
  fetchUser,
  fetchCsrfCookie,
  postLogin,
  postLogout,
  postRegister,
  postForgotPassword,
  postResetPassword,
} from '~/utils/api'

export function useAuth() {
  const config = useRuntimeConfig()
  const apiUrl = (config.public.apiUrl as string).replace(/\/$/, '')

  /** Pre-fetch CSRF cookie (client-side). Call when mounting auth pages so token is ready before submit. */
  async function ensureCsrfCookie(): Promise<void> {
    if (import.meta.server) return
    await fetchCsrfCookie(apiUrl)
  }

  const user = useState<AuthUser | null>('auth-user', () => null)
  const loading = useState('auth-loading', () => true)
  const error = useState<string | null>('auth-error', () => null)

  async function fetchAuthUser() {
    loading.value = true
    error.value = null
    try {
      user.value = await fetchUser(apiUrl)
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    error.value = null
    try {
      const { user: u } = await postLogin(apiUrl, { email, password })
      user.value = u
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login mislukt'
      return false
    }
  }

  async function logout() {
    error.value = null
    try {
      await postLogout(apiUrl)
    } catch {
      // ignore
    }
    user.value = null
  }

  async function register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    error.value = null
    try {
      const { user: u } = await postRegister(apiUrl, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      user.value = u
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registratie mislukt'
      return false
    }
  }

  async function forgotPassword(email: string) {
    error.value = null
    try {
      await postForgotPassword(apiUrl, { email })
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Versturen mislukt'
      return false
    }
  }

  async function resetPassword(
    token: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    error.value = null
    try {
      await postResetPassword(apiUrl, {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Wachtwoord resetten mislukt'
      return false
    }
  }

  return {
    user,
    loading,
    error,
    fetchAuthUser,
    ensureCsrfCookie,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    isAuthenticated: computed(() => !!user.value),
  }
}
