// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8000',
    },
  },
})
