import { ref, readonly, computed } from 'vue'

const TELEMETRY_OPT_OUT_KEY = 'rekenreis_telemetry_opt_out'

function getOptOut(): boolean {
  if (typeof window === 'undefined') return true
  const raw = localStorage.getItem(TELEMETRY_OPT_OUT_KEY)
  if (raw === null) return true
  return raw === '1' || raw === 'true'
}

type ProfileApi = {
  activeProfile: { value: { id: string; telemetryOptOut: boolean } | null }
  updateProfile: (id: string, u: Record<string, unknown>) => void
}

export function useTelemetry(profile?: ProfileApi) {
  const legacyOptOut = ref(getOptOut())

  const telemetryOptOut = computed(() =>
    profile?.activeProfile.value?.telemetryOptOut ?? legacyOptOut.value
  )

  function setOptOut(value: boolean) {
    if (profile?.activeProfile.value) {
      profile.updateProfile(profile.activeProfile.value.id, { telemetryOptOut: value })
    } else {
      legacyOptOut.value = value
      if (typeof window !== 'undefined') {
        localStorage.setItem(TELEMETRY_OPT_OUT_KEY, value ? '1' : '0')
      }
    }
  }

  return {
    telemetryOptOut: readonly(telemetryOptOut),
    setOptOut,
  }
}
