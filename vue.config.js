console.log('------------------------- ' + process.env.NODE_ENV + ' -------------------------')
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
      template: process.env.NODE_ENV === 'production' ? 'public/index-prod.html' : 'public/index.html',
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
      '/apis': {
        target: 'http://192.168.130.92'
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
  productionSourceMap: false // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // configureWebpack: {
  //   externals
  // }
}
