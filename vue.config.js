// 标记线上环境还是测试环境 development为开发或测试环境打包，production是生产环境打包

const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const HappyPack = require('happypack')
// const os = require('os')

// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const MODEL = process.argv[process.argv.indexOf('--model') + 1]
const { NODE_ENV } = process.env
const VERSION = process.env.npm_package_version
const SERVER = process.argv[process.argv.indexOf('--s') + 1]
const assetsDir = MODEL === 'production' ? `test/${ VERSION }/static` : 'static'
process.env.VUE_APP_VERSION = VERSION
process.env.VUE_APP_MODEL = MODEL

console.table([
    {
        NODE_ENV,
        MODEL,
        SERVER: `http://192.168.50.${ SERVER }`,
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
          'penglai-ui': 'PenglaiUI',
          axios: 'axios',
          swiper: 'swiper',
          'vue-awesome-swiper': 'VueAwesomeSwiper',
          'vue-lazyload': 'VueLazyload',
          moment: 'moment'
          // qs: 'Qs',
          // 'ali-oss': 'OSS',
          // compressorjs: 'Compressor',
          // 'pdfjs-dist': 'pdfjsLib',
          // 'vue-clipboard2': 'VueClipboard'
      }
      : {}

const optimization = {
    splitChunks: {
        // chunks: 'async',
        // minSize: 30000,
        // maxSize: 0,
        // minChunks: 1,
        // maxAsyncRequests: 6,
        // maxInitialRequests: 4,
        // automaticNameDelimiter: '~',
        cacheGroups: {
            vendors: {
                name: `chunk-vendors`,
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                chunks: 'all'
            },
            common: {
                name: `chunk-common`,
                minChunks: 2,
                priority: -20,
                chunks: 'initial',
                reuseExistingChunk: true
            },
            apis: {
                name: 'chunk-apis',
                test: /[\\/]src[\\/]apis[\\/]/,
                priority: 0
                // chunks: 'all'
            },
            // moment: {
            //     name: `chunk-moment`,
            //     test: /[\\/]node_modules[\\/]moment[\\/]/,
            //     priority: 0,
            //     chunks: 'all'
            // },
            aliOss: {
              name: `chunk-ali-oss`,
              test: /[\\/]node_modules[\\/]ali-oss[\\/]/,
              priority: 0,
              chunks: 'all'
            },
            // compressorjs: {
            //   name: `chunk-compressor`,
            //   test: /[\\/]node_modules[\\/]compressorjs[\\/]/,
            //   priority: 0,
            //   chunks: 'all'
            // },
            // qrcode: {
            //   name: `chunk-qrcode`,
            //   test: /[\\/]node_modules[\\/]qrcode[\\/]/,
            //   priority: 0,
            //   chunks: 'all'
            // },
            pdfjs: {
                name: `chunk-pdfjs`,
                test: /[\\/]node_modules[\\/]pdfjs-dist[\\/]/,
                priority: 0,
                chunks: 'all'
            },
            photoswipe: {
                name: `chunk-photoswipe`,
                test: /[\\/]node_modules[\\/]photoswipe[\\/]/,
                priority: 0,
                chunks: 'all'
            }
        }
    }
}

module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            template: MODEL === 'local'
              ? 'public-dev/my.html'
              : MODEL === 'development'
                ? 'public-dev/index.html'
                : 'public/my.html',
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
            // 测试37 开发34 王恩74 牛昌昌92 张涛126 任钊64 杜花171 river 148 wilson 146
            '/apis': {
                // target: 'https://mall.youpenglai.com'
                // target: `http://192.168.50.${ SERVER || 134 }`
                target: 'https://42.192.54.104:443'
            }
        },
        // 禁止检查域名
        disableHostCheck: true
    },

    css: {
        loaderOptions: {
            css: {
                localIdentName: '[local]-[hash:base64:10]',
                camelCase: 'only'
            },
            sass: {
                data: `@import "@/assets/scss/config.scss";@import "@/assets/scss/mixin.scss";`,
                options: {
                    implementation: require('sass')
                },
                // prependData: `@import "@/assets/scss/config.scss";`
            },
            postcss: {
                plugins: loader => [
                    require('postcss-px-to-viewport')({
                        viewportWidth: 750,
                        unitPrecision: 6,
                        minPixelValue: 1,
                        viewportUnit: 'vw',
                        mediaQuery: true,
                        selectorBlackList: ['html', 'body'],
                        exclude: /node_modules/
                    })
                ]
            }
        }
    },
    configureWebpack: {
        externals,
        // module: {
        //     rules: [
        //         {
        //             test: /\.js$/,
        //             loader: 'happypack/loader?id=happyBabel',
        //             // exclude: /node_modules/
        //         },
        //     ]
        // },
        plugins: [
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/
            }),
            new BundleAnalyzerPlugin(),
            // new HappyPack({
            //     id: 'happyBabel',
            //     loaders: ['babel-loader?cacheDirectory=true'],
            //     threadPool: happyThreadPool,
            //     verbose: true
            // })
        ],
        optimization
        // ...((process.env.NODE_ENV === 'production' && !process.env.CYPRESS_ENV) ? { optimization } : null)
    },
    pluginOptions: {
        SourceMapDevToolPlugin: {
            noSources: false
        }
    },
    productionSourceMap: MODEL === 'production',
    lintOnSave: true
}
