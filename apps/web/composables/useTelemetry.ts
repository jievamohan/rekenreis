const TELEMETRY_OPT_OUT_KEY = 'rekenreis_telemetry_opt_out'

function getOptOut(): boolean {
  if (typeof window === 'undefined') return true
  const raw = localStorage.getItem(TELEMETRY_OPT_OUT_KEY)
  if (raw === null) return true
  return raw === '1' || raw === 'true'
}

export function useTelemetry() {
  const telemetryOptOut = ref(getOptOut())

  function setOptOut(value: boolean) {
    telemetryOptOut.value = value
    if (typeof window !== 'undefined') {
      localStorage.setItem(TELEMETRY_OPT_OUT_KEY, value ? '1' : '0')
    }
  }

  return {
    telemetryOptOut: readonly(telemetryOptOut),
    setOptOut,
  }
}
