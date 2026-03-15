<script setup lang="ts">
const { register, error, isAuthenticated, ensureCsrfCookie } = useAuth()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const submitting = ref(false)

onMounted(async () => {
  if (isAuthenticated.value) {
    router.replace('/')
    return
  }
  await ensureCsrfCookie()
})

async function onSubmit() {
  submitting.value = true
  const ok = await register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )
  submitting.value = false
  if (ok) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Account aanmaken</h1>
    <form class="auth-form" @submit.prevent="onSubmit">
      <div v-if="error" class="auth-error" role="alert">
        {{ error }}
      </div>
      <label for="reg-name">Kindnaam</label>
      <input
        id="reg-name"
        v-model="name"
        type="text"
        required
        autocomplete="name"
        class="auth-input"
      />
      <label for="reg-email">E-mail</label>
      <input
        id="reg-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="auth-input"
      />
      <label for="reg-password">Wachtwoord</label>
      <input
        id="reg-password"
        v-model="password"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
        class="auth-input"
      />
      <label for="reg-password-confirm">Wachtwoord bevestigen</label>
      <input
        id="reg-password-confirm"
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
        {{ submitting ? 'Bezig...' : 'Registreren' }}
      </button>
    </form>
    <p class="auth-links">
      <NuxtLink to="/login">Al een account? Inloggen</NuxtLink>
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
