import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store/index'
import './assets/js/axios-config'
import 'moment/locale/zh-cn'
import './assets/scss/index.scss'
import './assets/fonts/svg/index'
import imgError from './assets/images/img_error.png'
import directive from './directive'
import { beforeResolve, onError } from './assets/js/router-guard'
import PenglaiUI from './components/penglai-ui'
import animated from 'animate.css'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import filters from './filter'
import './assets/css/quill.css'
import PlIcon from './components/Pl-Icon.vue'
Vue.use(VueLazyload, {
  error: imgError,
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
router.onError(onError)
/* 处理所有组件抛出的错误 */
Vue.config.errorHandler = async function (err, vm, info) {
  try {
    if (err.name === 'ResponseError') {
      // 响应出错
      let error = JSON.parse(err.message)
      vm.$error(error.message)
    } else {
      // 其它出错
      // console.error(JSON.stringify({
      //   errorType: err.name,
      //   info,
      //   route: vm.$route.fullPath,
      //   message: err.message,
      //   el: {
      //     tag: vm.$el.tagName,
      //     innerHTML: vm.$el.innerHTML,
      //     class: vm.$el.className
      //   }
      // }, null, 4))
    }
    console.error(err)
  } catch (e) {
    if (err.name !== 'MessageBoxCancel') {
      console.error(err)
    }
  }
}
