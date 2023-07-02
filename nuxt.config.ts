import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  debug: true,
  ssr: false,
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '~/assets/main.css',
    '~/assets/buttons.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  plugins: [
    { src: '~/plugins/bootstrap.js', mode: 'client'},
    { src: '~/plugins/fontawesome.js', mode: 'client'}
  ],
  app:{
    head: {
      title: 'Chess Insights',
      meta: [
        { charset: 'utf-8' },
        { 
          content: 'chess, chess insights, chess data, chess.com, pgn, win loss, openings, elo, bulk export, data visualization, free'
        }

      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },

  } 
  
})