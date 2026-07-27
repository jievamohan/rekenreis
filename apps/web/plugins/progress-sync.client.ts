import { watch } from 'vue'
import { useProfileSchema } from '~/composables/useProfileSchema'
import { useAuth } from '~/composables/useAuth'
import { useProgressSync } from '~/composables/useProgressSync'
import { loadProfiles } from '~/utils/profileSchema'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  // Empty apiUrl = same-origin (Docker / unified prod). Auth already uses this.
  const apiUrl = (config.public.apiUrl as string).replace(/\/$/, '')

  const schema = useProfileSchema()
  const { user } = useAuth()
  const { fetchAndHydrate, saveToApi } = useProgressSync(
    schema,
    apiUrl,
    () => !!user.value,
    () => user.value
  )

  watch(
    user,
    (u) => {
      if (u) {
        fetchAndHydrate()
      } else {
        schema.value = loadProfiles()
      }
    },
    { immediate: true }
  )

  watch(
    schema,
    (val) => {
      if (user.value && val) {
        saveToApi(val)
      }
    },
    { deep: true }
  )

  if (import.meta.client) {
    const flush = () => {
      if (user.value && schema.value) {
        saveToApi(schema.value, true)
      }
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
  }
})
