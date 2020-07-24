import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import { GET_MALL_INFO, LOGIN, USER_INFO } from './store/mutation-type'
import './assets/js/axios-config'
import 'moment/locale/zh-cn'
import './assets/scss/index.scss'
import directive from './directive'
import { beforeResolve, onError } from './assets/js/router-guard'
import PenglaiUI from './components/penglai-ui'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import filters from './filter'
import animated from 'animate.css'
import './assets/css/quill.css'
import './assets/css/fonts.css'
import PlSvg from './components/common/Pl-Svg.vue'
import MallQRCodeModal from './components/common/qrcode-modal'
// import { errorlog } from './apis/base-api'

import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Cookie from './assets/js/storage-cookie'

Vue.use(VueLazyload, {
    error: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png',
    lazyComponent: true,
    throttleWait: 150
})
Vue.use(animated)
Vue.use(VueClipboard)
Vue.component('pl-svg', PlSvg)

for (const k of Object.keys(directive)) {
    Vue.directive(k, directive[k])
}
for (const k of Object.keys(filters)) {
    Vue.filter(k, filters[k])
}

// UI组件库
Vue.use(PenglaiUI)
Vue.use(MallQRCodeModal)
Vue.config.productionTip = false

const render = () => {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App),
        renderError: (h, err) => {
            console.log(err)
        }
    })
    router.beforeResolve(beforeResolve)
    router.onError(onError)

    /* 处理所有组件抛出的错误 */
    Vue.config.errorHandler = async function (err, vm, info) {
        if (err) {
            if (err.name === 'ResponseError') {
                // 响应出错
                const error = JSON.parse(err.message)
                vm.$error(error.message)
            }
            console.error(err)
        }
    }
    const {
        VUE_APP_VERSION,
        NODE_ENV,
        VUE_APP_MODEL
    } = process.env
    console.log('version:', VUE_APP_VERSION)
    // 只有生产环境才启用日志
    if (NODE_ENV === VUE_APP_MODEL) {
        Sentry.init({
            dsn: 'https://e6c426498fe9427d870136c32b797567@frontlog.youpenglai.com/2',
            // 对应发布的版本号，这个版本号取自package.json中配置的版本号
            release: VUE_APP_VERSION,
            // 面包屑最大数量
            maxBreadcrumbs: 30,
            // VUE 集成
            integrations: [
                new Integrations.Vue({
                    Vue,
                    // 是否把错误打印到控制台
                    logErrors: false,
                    // Passing in attachProps is optional and is true if it is not provided. If you set it to false, Sentry will suppress sending all Vue components’ props for logging.
                    attachProps: true
                })
            ],
            beforeSend (event) {
                if (!event) {
                    return null
                }
                if ('message' in event && !event.message) {
                    return null
                }
                if (event.exception.values.some(item => item.value.match('登录信息失效，请重新获取') || item.type === 'UnhandledRejection')) {
                    return null
                }
                if (event.exception.values.some(item => item.type === 'ResponseError')) {
                    event.fingerprint = ['response-error']
                    event.level = 'warning'
                }
                return event
            }
        })
    }
}

const init = async () => {
    // 切换了商城之后，清空所有登录数据
    const mallDomain = window.location.pathname.split('/')[1]
    const preMallDomain = localStorage.getItem('CURRENT_MALL')
    if (preMallDomain !== mallDomain) {
        localStorage.setItem('CURRENT_MALL', mallDomain)
        Cookie.remove('token')
        Cookie.remove('refresh_token')
        Cookie.remove('mallId')
        Cookie.remove('agencyCode')
    }
    const token = Cookie.get('token')
    await store.dispatch(GET_MALL_INFO)
    if (!token) {
        await store.dispatch(LOGIN)
    }
    await store.dispatch(USER_INFO)
    render()
}
init()
