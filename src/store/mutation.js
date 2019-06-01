import * as type from './mutation-type'
import Cookie from 'js-cookie'
import { copyFields } from '../assets/js/util'
const CalcCookieTime = expire => {
  // 本地cookie较服务器提前一小时过期
  return new Date(Date.now() + expire * 1000 - 60000000)
}

export default {
  [type.SET_THEME] (state, theme) {
    state.theme = theme
    document.body.id = theme
  },
  [type.GET_MALL_INFO] (state, payload) {
    copyFields(state.mallInfo, payload)
    // 缓存10周
    Cookie.set('mallId', payload.sequenceNbr, {
      expires: CalcCookieTime(6048000)
    })
    Cookie.set('agencyCode', payload.agencyCode, {
      expires: CalcCookieTime(6048000)
    })
  },
  [type.USER_INFO] (state, payload) {
    copyFields(state.userInfo, payload)
  },
  [type.SET_TOKEN] (state, payload) {
    state.token = payload.token
    state.refresh_token = payload.refresh_token
    Cookie.set('token', payload.token, {
      expires: CalcCookieTime(payload.expire)
    })
    Cookie.set('refresh_token', payload.refresh_token, {
      expires: CalcCookieTime(payload.refresh_token_expire)
    })
  },
  [type.SET_OPENID] (state, payload) {
    state.openId = payload.openId
    localStorage.setItem('openId_' + payload.mallDomain, payload.openId)
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
  [type.LOG_OUT] () {
    Cookie.remove('mallId')
    Cookie.remove('openId')
    Cookie.remove('refresh_token')
    Cookie.remove('token')
    window.location.reload()
  },
  [type.SET_AVATAR] (state, payload) {
    state.userInfo.img = payload
  },
  [type.SET_USERNAME] (state, payload) {
    state.userInfo.userName = payload
  }
}
