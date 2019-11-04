const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const NODE_ENV = process.env.NODE_ENV
/* ********************************************* 环境 *************************************** */
console.log('------------------------- ' + NODE_ENV + ' -------------------------')
/* ********************************************* 模式 *************************************** */
console.log('------------------------- model: ' + MODEL + ' -------------------------')
const externals =
  // 生产环境或者开发模式，使用CDN库依赖
  process.env.NODE_ENV === 'production'
    ? {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'moment': 'moment',
      'axios': 'axios',
      'swiper': 'swiper',
      'vue-awesome-swiper': 'VueAwesomeSwiper',
      'ali-oss': 'OSS',
      'compressorjs': 'Compressor',
      'js-cookie': 'Cookies',
      'html2canvas': 'html2canvas'
    }
    : {}
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: MODEL === 'local' ? 'public-dev/local.html' : MODEL === 'development' ? 'public-dev/index-dev.html' : 'public/index.html',
      filename: 'index.html'
    }
  },

  assetsDir: 'static',
  outputDir: 'mall',

  devServer: {
    host: '0.0.0.0',
    port: 4000,
    hot: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // 37测试 34开发 王恩74 李宾哲132 赵伟116 牛昌昌92 张涛77 任钊64
      '/apis': {
        // target: 'http://mall.youpenglai.com'
        target: 'http://192.168.130.34'
      },
      '/live/': {
        // target: 'http://mall.youpenglai.com'
        target: 'http://api.polyv.net'
      }
    }
  },

  css: {
    loaderOptions: {
      css: {
        localIdentName: '[local]-[hash:base64:10]',
        camelCase: 'only'
      },
      sass: {
        data: `@import "@/assets/scss/config.scss";`
      },
      postcss: {
        plugins: loader => [
          require('postcss-px-to-viewport')({
            viewportWidth: 750,
            unitPrecision: 6,
            minPixelValue: 1,
            viewportUnit: 'vw',
            mediaQuery: false,
            selectorBlackList: ['html', 'body'],
            exclude: /node_modules/
          })
        ]
      }
    }
  },
  configureWebpack: {
    externals
  },
  productionSourceMap: false,

  lintOnSave: true
}
