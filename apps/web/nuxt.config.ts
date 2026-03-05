// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      title: 'Rekenreis',
    },
  },
  css: ['~/assets/css/graphics.css', '~/assets/css/tokens.css'],
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8000',
    },
  },
  routeRules: {
    '/play': { ssr: false },
    '/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  },
})
