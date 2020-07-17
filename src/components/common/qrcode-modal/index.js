import MallQRCodeModal from './Modal.vue'
import store from '../../../store'

const install = Vue => {
    Vue.prototype.$showMallQRCOde = () => {
        const Constructor = Vue.extend(MallQRCodeModal)
        const Instance = new Constructor({ store }).$mount()
        document.body.appendChild(Instance.$el)
        Instance.show = true
    }
}

export default {
    install
}
