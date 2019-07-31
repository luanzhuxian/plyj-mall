import Vue from 'vue'
import ToastComponent from './Toast.vue'

let ToastConstructor = Vue.extend(ToastComponent)
ToastConstructor.prototype.close = function () {
  this.show = false
  this.$el.addEventListener('animationend', removeDom)
}
/**
* 显示提示框
* options: { message, duration }
* message: 消息
* duration: 显示的时长
* */
export const Toast = (options = {}) => {
  let instance = new ToastConstructor({
    el: document.createElement('div')
  })
  clearTimeout(instance.timer)
  let duration = options.duration || 3000
  if (typeof options === 'string') {
    instance.message = options
  }
  if (typeof options === 'object') {
    instance.message = options.message
    instance.type = options.type
    instance.countDownTime = options.countDownTime
    if (options.slot) {
      instance.$slots.default = options.slot
    }
  }
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.show = !!instance.message // 消息为空时不显示
    instance.timer = setTimeout(() => {
      instance.close()
    }, duration)
  })
  return instance
}

function removeDom (e) {
  e.target.parentNode.removeChild(e.target)
  e.target.removeEventListener('animationend', removeDom)
}

Vue.prototype.$toast = options => {
  if (typeof options !== 'object') {
    console.error('options must be an object')
    return
  }
  Toast(options)
}
Vue.prototype.$error = options => {
  Toast({
    type: 'error',
    options
  })
}
Vue.prototype.$success = message => {
  Toast({
    type: 'success',
    message
  })
}
Vue.prototype.$warning = message => {
  Toast({
    type: 'warning',
    message
  })
}
