import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import { USER_INFO, LOGIN, GET_MALL_INFO } from './store/mutation-type'
import './assets/js/axios'
import './assets/scss/index.scss'
import './assets/css/quill.css'
import './assets/css/fonts.css'
import 'moment/locale/zh-cn'
import directive from './directive'
import filters from './filter'
import { beforeResolve, onError } from './assets/js/router-guard'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import GetCode from './components/common/Get-Code.vue'
import UploadImg from './components/common/Upload-Img.vue'
import MallQRCodeModal from './components/common/qrcode-modal'
import MessageBox from './components/penglai-ui/message-box'
// import PenglaiUI from './components/penglai-ui'
import PenglaiUI from 'penglai-ui'
import '../node_modules/penglai-ui/dist/pl-ui.cjs.css'
// import { errorlog } from './apis/base-api'

import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Cookie from './assets/js/storage-cookie'

// 注册全局组件
Vue.use(VueLazyload, {
    error: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png',
    lazyComponent: true,
    throttleWait: 150
})
Vue.use(VueClipboard)
Vue.use(PenglaiUI)
Vue.use(MallQRCodeModal)
Vue.component(GetCode.name, GetCode)
Vue.component(UploadImg.name, UploadImg)

for (const k of Object.keys(directive)) {
    Vue.directive(k, directive[k])
}
for (const k of Object.keys(filters)) {
    Vue.filter(k, filters[k])
}

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
    Vue.config.errorHandler = function (err, vm, info) {
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
                if (event.exception.values.some(item => item.value.match('4002') || item.type === 'UnhandledRejection')) {
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
    try {
        const token = Cookie.get('token')
        await store.dispatch(GET_MALL_INFO)
        // 微信公众号登录
        if (!token) {
            const SUCCESS = await store.dispatch(LOGIN)
            if (!SUCCESS) return
        }
        await store.dispatch(USER_INFO)
        render()
    } catch (err) {
        if (err && err.name === 'ResponseError') {
            // 响应出错
            const error = JSON.parse(err.message)
            MessageBox.alert(error.message)
                .then(() => {})
                .catch(() => {})
        } else {
            MessageBox.alert(err.message)
                .then(() => {})
                .catch(() => {})
        }
    }
}

init()
