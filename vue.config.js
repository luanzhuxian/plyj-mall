/* ********************************************* 环境 *************************************** */
console.log('------------------------- ' + process.env.NODE_ENV + ' -------------------------')
let argv = process.argv
let model = argv[argv.indexOf('--model') + 1]
/* ********************************************* 模式 *************************************** */
console.log('------------------------- model: ' + model + ' -------------------------')

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
      'vue-awesome-swiper': 'VueAwesomeSwiper'
    }
    : {}
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: process.env.NODE_ENV === 'development' ? 'public-dev/local.html' : model === 'dev' ? 'public-dev/index-dev.html' : 'public/index.html',
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
      // 37测试 34开发 王恩74 李宾哲132 赵伟116 牛昌昌92
      '/apis': {
        target: 'http://192.168.130.34'
      }
    }
  },

  css: {
    loaderOptions: {
      css: {
        localIdentName: '[local]_[hash:base64:10]',
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
