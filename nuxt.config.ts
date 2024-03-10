// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    dubApiKey: process.env.DUB_API_KEY ?? ''
  }
});
