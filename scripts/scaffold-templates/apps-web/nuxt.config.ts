// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
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
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
      ],
    },
  },
  css: ['~/assets/css/app.css'],
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
      xsrfDebugLog: process.env.NUXT_PUBLIC_XSRF_DEBUG_LOG === '1',
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
