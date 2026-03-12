<script setup lang="ts">
const { login, error, isAuthenticated, ensureCsrfCookie } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
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
  const ok = await login(email.value, password.value)
  submitting.value = false
  if (ok) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Inloggen</h1>
    <form class="auth-form" @submit.prevent="onSubmit">
      <div v-if="error" class="auth-error" role="alert">
        {{ error }}
      </div>
      <label for="login-email">E-mail</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="auth-input"
      />
      <label for="login-password">Wachtwoord</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="auth-input"
      />
      <button
        type="submit"
        class="auth-submit"
        :disabled="submitting"
      >
        {{ submitting ? 'Bezig...' : 'Inloggen' }}
      </button>
    </form>
    <p class="auth-links">
      <NuxtLink to="/register">Account aanmaken</NuxtLink>
      <NuxtLink to="/forgot-password">Wachtwoord vergeten?</NuxtLink>
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
  display: flex;
  flex-direction: column;
  gap: var(--app-space-sm);
}
.auth-links a {
  color: var(--app-primary);
}
</style>
