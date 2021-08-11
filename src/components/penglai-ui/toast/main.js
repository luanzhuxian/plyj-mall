import Vue from 'vue'
import ToastComponent from './Toast.vue'

const ToastConstructor = Vue.extend(ToastComponent)

/**
* 显示提示框
* options: { message, duration }
* message: 消息
* duration: 显示的时长
* */
const Toast = (options = {}) => {
    const instance = new ToastConstructor({
        el: document.createElement('div')
    })
    clearTimeout(instance.timer)
    const duration = options.duration || 3000
    if (typeof options === 'string') {
        instance.message = options
    }
    if (typeof options === 'object') {
        instance.message = options.message
        instance.viceMessage = options.viceMessage
        instance.type = options.type
        instance.countDownTime = options.countDownTime
        if (options.slot) {
            instance.$slots.default = options.slot
        }
    }
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
        // 消息为空时不显示
        instance.show = !!instance.message
        instance.timer = setTimeout(() => {
            instance.close()
        }, duration)
    })
    return instance
}

const toast = options => {
    if (typeof options !== 'object') {
        console.error('options must be an object')
        return
    }
    Toast(options)
}
const success = message => {
    if (typeof message === 'string') {
        Toast({
            type: 'success',
            message
        })
    } else {
        Toast({
            type: 'success',
            ...message
        })
    }
}
const error = message => {
    if (typeof message === 'string') {
        Toast({
            type: 'error',
            message
        })
    } else {
        Toast({
            type: 'error',
            ...message
        })
    }
}
const warning = message => {
    if (typeof message === 'string') {
        Toast({
            type: 'warning',
            message
        })
    } else {
        Toast({
            type: 'warning',
            ...message
        })
    }
}

const install = Vue => {
    Vue.prototype.$toast = toast
    Vue.prototype.$success = success
    Vue.prototype.$error = error
    Vue.prototype.$warning = warning
}

export default {
    toast,
    success,
    error,
    warning,
    install
}
