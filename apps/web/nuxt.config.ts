// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/graphics.css'],
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8000',
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  },
})
