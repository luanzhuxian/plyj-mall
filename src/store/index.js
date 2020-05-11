import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutation'
import actions from './actions'
import getters from './getter'
import order from './modules/order'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        order
    },
    state,
    mutations,
    actions,
    getters
})
