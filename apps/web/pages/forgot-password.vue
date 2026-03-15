<script setup lang="ts">
const { forgotPassword, error, ensureCsrfCookie } = useAuth()

const email = ref('')

onMounted(() => {
  ensureCsrfCookie()
})
const submitting = ref(false)
const success = ref(false)

async function onSubmit() {
  submitting.value = true
  success.value = false
  const ok = await forgotPassword(email.value)
  submitting.value = false
  if (ok) {
    success.value = true
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Wachtwoord vergeten</h1>
    <form v-if="!success" class="auth-form" @submit.prevent="onSubmit">
      <div v-if="error" class="auth-error" role="alert">
        {{ error }}
      </div>
      <p class="auth-hint">
        Vul je e-mailadres in. We sturen je een link om je wachtwoord te resetten.
      </p>
      <label for="forgot-email">E-mail</label>
      <input
        id="forgot-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="auth-input"
      />
      <button
        type="submit"
        class="auth-submit"
        :disabled="submitting"
      >
        {{ submitting ? 'Bezig...' : 'Verstuur link' }}
      </button>
    </form>
    <div v-else class="auth-success">
      <p>Als dit e-mailadres bij ons bekend is, ontvang je een link om je wachtwoord te resetten.</p>
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
.auth-hint {
  color: var(--app-text-muted);
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
