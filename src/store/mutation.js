import * as type from './mutation-type'
export default {
  [type.SET_THEME] (state, theme) {
    state.theme = theme
    document.body.id = theme
  },
  [type.GET_MALL_INFO] (state, payload) {
    for (let k of Object.keys(state.mallInfo)) {
      state.mallInfo[k] = payload[k]
    }
  },
  [type.USER_INFO] (state, payload) {
    for (let k of Object.keys(state.userInfo)) {
      state.userInfo[k] = payload[k]
    }
  },
  [type.SET_TOKEN] (state, payload) {
    state.token = payload
    localStorage.setItem('token', payload)
  },
  [type.ADDRESS_LIST] (state, payload) {
    state.addressList = payload
  },
  [type.SELETC_ADDRESS] (state, payload) {
    if (!payload) {
      state.selectedAddress = null
      return
    }
    if (payload.length === 0) {
      state.selectedAddress = null
      return
    }
    state.selectedAddress = payload
  },
  [type.LOG_OUT] (state, payload) {
    state.token = ''
    sessionStorage.clear()
    localStorage.clear()
  }
}
