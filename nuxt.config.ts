// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/plausible'
  ],
  runtimeConfig: {
    dubApiKey: process.env.DUB_API_KEY ?? ''
  },
  plausible: {
    domain: process.env.PLAUSIBLE_DOMAIN ?? 'dm.new'
  }
});
