import Vue from 'vue'
import LoadingComponent from './Loading.vue'

const LoadingConstructor = Vue.extend(LoadingComponent)

const Loading = options => {
    const instance = new LoadingConstructor({
        el: document.createElement('div')
    })
    if (typeof options === 'string') {
        instance.message = options
    }
    if (typeof options === 'object') {
        const { message, mask } = options
        instance.message = message
        instance.mask = mask
    }
    instance.show = true
    document.body.appendChild(instance.$el)
    return instance
}

const install = Vue => {
    Vue.prototype.$loading = Loading
}

export default {
    Loading,
    install
}
