console.log('------------------------- ' + process.env.NODE_ENV + ' -------------------------')
let argv = process.argv
let model = argv[argv.indexOf('--model') + 1]
console.log('------------------------- model: ' + model + ' -------------------------')
// const externals =
//   process.env.NODE_ENV === 'production'
//     ? {
//       'vue': 'Vue',
//       'vuex': 'Vuex',
//       'vue-router': 'VueRouter',
//       'axios': 'axios'
//     }
//     : {}
module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: (model === 'dev' || process.env.NODE_ENV === 'development') ? 'public/index.html' : 'public/index-prod.html',
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
        target: 'http://192.168.130.74'
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

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // configureWebpack: {
  //   externals
  // }
  productionSourceMap: false,

  lintOnSave: true
}
