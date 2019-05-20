import * as type from './mutation-type'
import Cookie from 'js-cookie'

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
    state.token = payload.token
    state.refresh_token = payload.refresh_token
    state.openId = payload.openId
    Cookie.set('token', payload.token, {
      expires: new Date(Date.now() + payload.expire * 1000 - 60000000)
    })
    Cookie.set('refresh_token', payload.refresh_token, {
      expires: new Date(Date.now() + payload.refresh_token_expire * 1000 - 60000000)
    })
  },
  [type.SET_OPENID] (state, payload) {
    state.openId = payload.openId
    localStorage.setItem(payload.mallSeq, payload.openId)
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
