// 标记线上环境还是测试环境 development为开发或测试环境打包，production是生产环境打包
const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const { NODE_ENV } = process.env
const VERSION = process.env.npm_package_version
const SERVER = process.argv[process.argv.indexOf('--s') + 1]
const assetsDir = MODEL === 'development' ? 'static' : `${ VERSION }/static`
process.env.VUE_APP_VERSION = VERSION
process.env.VUE_APP_MODEL = MODEL

/* ********************************************* 环境 *************************************** */
console.log(`------------------------- ${ NODE_ENV } -------------------------`)

/* ********************************************* 模式 *************************************** */
console.log(`------------------------- model: ${ MODEL } -------------------------`)

/* ********************************************* 服务 *************************************** */
console.log(`------------------------- server: ${ SERVER } -------------------------`)

console.log(`------------------------- assetsDir: ${ assetsDir } -------------------------`)
console.log(`------------------------- version: ${ VERSION } -------------------------`)

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
          'vue-clipboard2': 'VueClipboard'
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
            // 测试37 开发34 王恩74 李宾哲132 牛昌昌92 张涛149 刘兵227 任钊64 崔璐115 杜花171
            '/apis': {

                // target: 'https://mall.youpenglai.com'
                target: `http://192.168.130.${ SERVER || 34 }`

                // target: 'http://192.168.255.14'
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
    productionSourceMap: true,

    lintOnSave: true
}
