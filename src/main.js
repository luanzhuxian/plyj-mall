import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import './assets/js/axios-config'
import 'moment/locale/zh-cn'
import './assets/scss/index.scss'
import './assets/fonts/svg/index'
import directive from './directive'
import { beforeResolve, beforeEach, onError } from './assets/js/router-guard'
import PenglaiUI from './components/penglai-ui'
import animated from 'animate.css'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import filters from './filter'
import './assets/css/quill.css'
import PlIcon from './components/common/Pl-Icon.vue'
import { errorlog } from './apis/base-api'
Vue.use(VueLazyload, {
  error: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png',
  lazyComponent: true,
  throttleWait: 150
})
Vue.use(animated)
Vue.use(VueClipboard)
Vue.component('pl-icon', PlIcon)
// Vue.use(SvgIcon, {
//   tagName: 'svgicon'
// })
for (let k of Object.keys(directive)) {
  Vue.directive(k, directive[k])
}
for (let k of Object.keys(filters)) {
  Vue.filter(k, filters[k])
}
// UI组件库
Vue.use(PenglaiUI)
Vue.config.productionTip = false
/* eslint-disable */
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
router.beforeEach(beforeEach)
router.onError(onError)
/* 处理所有组件抛出的错误 */
Vue.config.errorHandler = async function (err, vm, info) {
  try {
    if (err.name === 'ResponseError') {
      // 响应出错
      let error = JSON.parse(err.message)
      vm.$error(error.message)
    } else {
      errorlog({
        info,
        message: err.message,
        url: location.href,
        userId: vm.$store.getters.userId,
        mallId: vm.$store.getters.mallId,
        vm: {
          name: vm.$options.name || '',
          class: Array.from(vm.$el.classList || []).join(';'),
          id: vm.$el.id || '',
          parent: {
            class: Array.from(vm.$parent.$el.classList || []).join(';'),
            id: vm.$parent.$el.id || '',
          }
        }
      })
    }
    console.error(err)
  } catch (e) {
    if (err.name !== 'MessageBoxCancel') {
      console.error(err)
    }
  }
}
