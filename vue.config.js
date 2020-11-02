// 标记线上环境还是测试环境 development为开发或测试环境打包，production是生产环境打包
const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const { NODE_ENV } = process.env
const VERSION = process.env.npm_package_version
const SERVER = process.argv[process.argv.indexOf('--s') + 1]
const assetsDir = MODEL === 'development' ? 'static' : `${ VERSION }/static`
process.env.VUE_APP_VERSION = VERSION
process.env.VUE_APP_MODEL = MODEL

console.table([
    {
        NODE_ENV,
        MODEL,
        SERVER: `http://192.168.130.${ SERVER }`,
        assetsDir,
        VERSION
    }
])

const externals =
  // 生产环境或者开发模式，使用CDN库依赖
  process.env.NODE_ENV === 'production'
      ? {
          vue: 'Vue',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          moment: 'moment',
          axios: 'axios',
          swiper: 'swiper',
          'vue-awesome-swiper': 'VueAwesomeSwiper',
          'ali-oss': 'OSS',
          compressorjs: 'Compressor',
          'vue-lazyload': 'VueLazyload',
          qs: 'Qs',
          'vue-clipboard2': 'VueClipboard',
          'pdfjs-dist': 'pdfjsLib'
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

    assetsDir,
    outputDir: `mall`,
    devServer: {
        host: '0.0.0.0',
        port: 4000,
        hot: true,
        open: true,
        overlay: {
            warnings: true,
            errors: true
        },
        // 如果设置为true，devServer会把编译后的文件存入磁盘，而不是存入内存，这样热刷新会慢一点，但是会节省内存
        writeToDisk: false,
        proxy: {
            // 测试37 开发34 王恩74 李宾哲132 牛昌昌92 张涛149 刘兵227 任钊64 崔璐115 杜花171 river 127
            '/apis': {
                // target: 'https://yumall.youpenglai.com'
                target: `http://192.168.50.${ SERVER || 134 }`
                // target: 'http://192.168.255.14'
            },
            '/live/': {
                // target: 'http://mall.youpenglai.com'
                target: 'http://api.polyv.net'
            }
        },
        disableHostCheck: false
    },

    css: {
        loaderOptions: {
            css: {
                localIdentName: '[local]-[hash:base64:10]',
                camelCase: 'only'
            },
            sass: {
                data: `@import "@/assets/scss/config.scss";`,
                options: {
                    implementation: require('sass')
                }
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
    pluginOptions: {
        SourceMapDevToolPlugin: {
            noSources: false
        }
    },
    productionSourceMap: MODEL === 'production',

    lintOnSave: true
}
