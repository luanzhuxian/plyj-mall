import Vue from 'vue'
import MessageBpx from './Message-Box.vue'
/* eslint-disable */
/*
* 消息盒子弹框
* 种类：
* confirm - 确定框，带有取消和确定两个按钮 用法: vm.$confirm(config)
* alert - 提示框，仅作为提示弹框 用法: vm.$alert(config)
* propmt - 带有输入框的弹框 用法: vm.$propmt(config)
* config - [Object, String] 如果传入string, string将作为message展示
*
* */
const MessageBoxClass = Vue.extend(MessageBpx)
const confirm = (config = {}) => new Promise((resolve, reject) => {
    if (typeof config === 'string') {
        config = { message: config }
    }
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', viceMessage = '', html = '', message = '', icon, closeOnClickMask = true, confirmStyle, cancelStyle, useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.html = html
        Instance.message = message
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = viceMessage
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
    if (typeof config === 'string') {
        config = { message: config }
    }
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', viceMessage = '', message = '', icon, confirmStyle, cancelStyle, useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.message = message
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = viceMessage
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
    if (typeof config === 'string') {
        config = { message: config }
    }
    const Instance = new MessageBoxClass({
        el: document.createElement('div')
    })
    document.body.appendChild(Instance.$el)
    const { slot = null, cancelText = '取消', confirmText = '确定', viceMessage = '', message = '', icon = '', placeholder = '请输入', rules = [], value = '', useDangersHtml = false } = config
    if (slot) {
        Instance.$slots.default = [slot]
    }
    Instance.$nextTick(() => {
        Instance.message = message
        Instance.useDangersHtml = useDangersHtml
        Instance.viceMessage = viceMessage
        Instance.placeholder = placeholder
        Instance.propmtValue = value
        Instance.rules = rules
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
    propmt,
    install
}
