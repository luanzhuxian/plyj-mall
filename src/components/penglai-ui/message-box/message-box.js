import Vue from 'vue'
import MessageBpx from './Message-Box.vue'
/* eslint-disable */
const MessageBoxClass = Vue.extend(MessageBpx)
const confirm = (config = {}) => new Promise((resolve, reject) => {
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', title = '', html = '', message = '', icon, closeOnClickMask = true, confirmStyle, cancelStyle, useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.html = html
        Instance.message = title
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = message
        if (typeof config === 'string') {
            Instance.title = config
        }
        Instance.cancelText = cancelText
        Instance.confirmText = confirmText
        Instance.confirmStyle = confirmStyle
        Instance.cancelStyle = cancelStyle
        Instance.icon = icon
        Instance.type = 'confirm'
        Instance.show = true
        Instance.closeOnClickMask = closeOnClickMask
        Instance.$on('cancel', () => {
            reject(false)
        })
        Instance.$on('confirm', () => {
            resolve()
        })
    })
})
const alert = (config = {}) => new Promise((resolve, reject) => {
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', title = '', message = '', icon, confirmStyle, cancelStyle, useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.message = title
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = message
        if (typeof config === 'string') {
            Instance.title = config
        }
        Instance.cancelText = cancelText
        Instance.confirmText = confirmText
        Instance.confirmStyle = confirmStyle
        Instance.cancelStyle = cancelStyle
        Instance.type = 'alert'
        Instance.icon = icon
        Instance.show = true
        Instance.$on('cancel', () => {
            reject(false)
        })
        Instance.$on('confirm', () => {
            resolve()
        })
    })
})
const propmt = (config = {}) => new Promise((resolve, reject) => {
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', title = '', message = '', icon, placeholder = '请输入', rules = [], value = '', useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.message = title
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = message
        Instance.placeholder = placeholder
        Instance.propmtValue = value
        Instance.rules = rules
        if (typeof config === 'string') {
            Instance.title = config
        }
        Instance.cancelText = cancelText
        Instance.confirmText = confirmText
        Instance.type = 'propmt'
        Instance.icon = icon
        Instance.show = true
        Instance.$on('cancel', () => {
            reject(false)
        })
        Instance.$on('confirm', val => {
            resolve(val)
        })
    })
})

const install = Vue => {
    Vue.prototype.$alert = alert
    Vue.prototype.$confirm = confirm
    Vue.prototype.$propmt = propmt
}

export const MessageBox = {
    confirm,
    alert,
    install
}
