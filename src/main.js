import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import './assets/js/axios-config'
import 'moment/locale/zh-cn'
import './assets/scss/index.scss'
import './assets/fonts/svg/index'
import 'mint-ui/lib/style.min.css'
import imgError from './assets/images/img_error.png'
import directive from './directive'
import { beforeEach, onError } from './assets/js/router-guard'
import PenglaiUI from './components/penglai-ui'
import { Toast } from './components/penglai-ui/toast'
import animated from 'animate.css'
import gallery from 'img-vuer'
import VueLazyload from 'vue-lazyload'
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerVue from 'alloyfinger/vue/alloy_finger_vue'
import filters from './filter'
// import LogLine from 'logline'
// import { saveLog } from './apis/base-api'
// LogLine.using(LogLine.PROTOCOL.INDEXEDDB)
Vue.use(VueLazyload, {
  error: imgError
})
Vue.use(gallery, {
  swipeThreshold: 150
})
Vue.use(animated)
// Vue.use(AlloyFingerVue, { AlloyFinger })

for (let k of Object.keys(directive)) {
  Vue.directive(k, directive[k])
}
for (let k of Object.keys(filters)) {
  Vue.filter(k, filters[k])
}
/* 路由守卫 */
Vue.use(PenglaiUI)
Vue.config.productionTip = false
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  renderError: (h, err) => {
    console.error(err)
  }
})

router.beforeResolve(beforeEach)
router.onError(onError)
/* 处理所有组件抛出的错误 */
Vue.config.errorHandler = async function (err, vm, info) {
  let message = err.message
  let error
  if (/responseError/.test(message)) {
    error = JSON.parse(err.message)
    error.component = vm.$options.name
    error.rotue = vm.$route
  } else {
    error = {
      tag: 'otherError',
      component: vm.$options.name,
      message: err.message,
      rotue: vm.$route
    }
  }
  Toast(error.message)
  // try {
  //   await saveLog(error)
  // } catch (e) {
  //   console.error(e)
  // }
}
