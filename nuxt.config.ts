// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  plugins: [{ src: '~/plugins/p5.client.js', mode: 'client' }],
  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  },
  app:{
  head: {
    title: "CD's Juletræ",
    link: [
      { rel: 'stylesheet', href: 'https://use.typekit.net/brt8wqh.css' },
      { rel: 'preload', href: 'https://use.typekit.net/brt8wqh.css', as: 'style' }
    ]
  },
},
})

