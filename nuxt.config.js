export default {
  // Target: https://go.nuxtjs.dev/config-target
  // ssr: false,
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'asas',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/firebase' },
    { src: "~plugins/persistedstate.js", mode: 'client' },
    { src: '~/plugins/sliderComponent.js', mode: 'client'},
    { src: '~/plugins/audio-visual.js', mode: 'client'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy'
  ],

  styleResources: {
    scss: [
      '@/assets/css/_mixin.scss',
      '@/assets/css/_variables.scss'
    ],
  },

  proxy: {
    '/api/': { target: 'https://asia-northeast1-asas-50dbf.cloudfunctions.net/', pathRewrite: {'^/api/': ''} }
  },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-audio-visual'],
  }
}
