import { ref } from 'vue'
import { loadProfiles, type ProfileSchemaV1 } from '~/utils/profileSchema'

let schemaRef: ReturnType<typeof ref<ProfileSchemaV1>> | null = null

export function useProfileSchema() {
  if (!schemaRef) {
    schemaRef = ref<ProfileSchemaV1>(loadProfiles())
  }
  return schemaRef
}

/** Reset schema ref (for tests only). */
export function __resetProfileSchema() {
  schemaRef = null
}
