import Vue from 'vue'
import MessageBpx from './Message-Box.vue'
let MessageBoxClass = Vue.extend(MessageBpx)
let Instance = new MessageBoxClass({
  el: document.createElement('div')
})
let confirm = (config = {}) => {
  return new Promise((resolve, reject) => {
    document.body.appendChild(Instance.$el)
    Instance.$nextTick(() => {
      let { cancelText = '取消', confirmText = '确定', message = '', viceMessage = '', icon } = config
      Instance.message = message
      Instance.viceMessage = viceMessage
      if (typeof config === 'string') {
        Instance.message = config
      }
      Instance.cancelText = cancelText
      Instance.confirmText = confirmText
      Instance.icon = icon
      Instance.type = 'confirm'
      Instance.show = true
      Instance.$on('cancel', function () {
        reject(new Error(''))
      })
      Instance.$on('confirm', function () {
        resolve()
      })
    })
  })
}
let alert = (config = {}) => {
  return new Promise((resolve, reject) => {
    document.body.appendChild(Instance.$el)
    Instance.$nextTick(() => {
      let { cancelText = '取消', confirmText = '确定', message = '', viceMessage = '', icon } = config
      Instance.message = message
      Instance.viceMessage = viceMessage
      if (typeof config === 'string') {
        Instance.message = config
      }
      Instance.cancelText = cancelText
      Instance.confirmText = confirmText
      Instance.type = 'alert'
      Instance.icon = icon
      Instance.show = true
      Instance.$on('cancel', function () {
        reject(new Error(''))
      })
      Instance.$on('confirm', function () {
        resolve()
      })
    })
  })
}

let install = (Vue) => {
  Vue.prototype.$alert = alert
  Vue.prototype.$confirm = confirm
}

export const MessageBox = {
  confirm,
  alert,
  install
}
