import { watch } from 'vue'
import { useProfileSchema } from '~/composables/useProfileSchema'
import { useAuth } from '~/composables/useAuth'
import { useProgressSync } from '~/composables/useProgressSync'
import { loadProfiles } from '~/utils/profileSchema'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiUrl = (config.public.apiUrl as string).replace(/\/$/, '')
  if (!apiUrl) return

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
})
