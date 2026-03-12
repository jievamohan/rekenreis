<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { resetPassword, error } = useAuth()

const token = computed(() => (route.query.token as string) || '')
const email = ref((route.query.email as string) || '')
const password = ref('')
const passwordConfirmation = ref('')
const submitting = ref(false)
const success = ref(false)

async function onSubmit() {
  submitting.value = true
  const ok = await resetPassword(
    token.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )
  submitting.value = false
  if (ok) {
    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Wachtwoord resetten</h1>
    <form v-if="!success" class="auth-form" @submit.prevent="onSubmit">
      <div v-if="error" class="auth-error" role="alert">
        {{ error }}
      </div>
      <div v-if="!token" class="auth-error" role="alert">
        Ongeldige of ontbrekende resetlink. Vraag een nieuwe aan.
      </div>
      <template v-else>
        <label for="reset-email">E-mail</label>
        <input
          id="reset-email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="auth-input"
        />
        <label for="reset-password">Nieuw wachtwoord</label>
        <input
          id="reset-password"
          v-model="password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="auth-input"
        />
        <label for="reset-password-confirm">Wachtwoord bevestigen</label>
        <input
          id="reset-password-confirm"
          v-model="passwordConfirmation"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="auth-input"
        />
        <button
          type="submit"
          class="auth-submit"
          :disabled="submitting"
        >
          {{ submitting ? 'Bezig...' : 'Wachtwoord opslaan' }}
        </button>
      </template>
    </form>
    <div v-else class="auth-success">
      <p>Wachtwoord opgeslagen. Je wordt doorgestuurd naar de loginpagina.</p>
    </div>
    <p class="auth-links">
      <NuxtLink to="/login">Terug naar inloggen</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-page {
  padding: var(--app-space-xl);
  max-width: 400px;
  margin: 0 auto;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--app-space-md);
}
.auth-error {
  color: var(--app-wrong);
  padding: var(--app-space-sm);
  background: rgba(255, 138, 101, 0.2);
  border-radius: var(--app-radius-md);
}
.auth-success {
  padding: var(--app-space-md);
  background: rgba(105, 240, 174, 0.2);
  border-radius: var(--app-radius-md);
}
.auth-input {
  min-height: var(--app-tap-min);
  padding: var(--app-space-sm) var(--app-space-md);
  font-size: var(--app-font-size-lg);
  border-radius: var(--app-radius-md);
  border: 2px solid var(--app-muted);
  background: var(--app-surface);
  color: var(--app-text-on-surface);
}
.auth-input:focus {
  outline: none;
  border-color: var(--app-primary);
}
.auth-submit {
  min-height: var(--app-tap-min);
  padding: var(--app-space-md);
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-bold);
  background: var(--app-primary);
  color: var(--app-text-on-surface);
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
}
.auth-submit:hover:not(:disabled) {
  background: var(--app-primary-hover);
}
.auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.auth-links {
  margin-top: var(--app-space-lg);
}
.auth-links a {
  color: var(--app-primary);
}
</style>
