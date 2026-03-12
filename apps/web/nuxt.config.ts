// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // Vite watch + HMR for reliable hot reload in Docker (bind mounts)
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 24678,
      },
    },
  },
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
    apiProxyTarget: process.env.NUXT_API_PROXY_TARGET || 'http://api:8000',
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL === ''
          ? ''
          : (process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000'),
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
