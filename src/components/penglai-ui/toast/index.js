import Vue from 'vue'
import ToastComponent from './Toast.vue'

let ToastConstructor = Vue.extend(ToastComponent)
let instance = new ToastConstructor({
  el: document.createElement('div')
})
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
  // let instance = getInstance()
  clearTimeout(instance.timer)
  let duration = options.duration || 3000
  if (typeof options === 'string') {
    instance.message = options
  }
  if (typeof options === 'object') {
    instance.message = options.message
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
