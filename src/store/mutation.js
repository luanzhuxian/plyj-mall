import * as type from './mutation-type'
import Cookies from 'js-cookie'
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
    sessionStorage.setItem('mallName', payload.mallName)
    // 缓存10周
    Cookies.set('mallId', payload.sequenceNbr, {
      expires: CalcCookieTime(6048000)
    })
    Cookies.set('agencyCode', payload.agencyCode, {
      expires: CalcCookieTime(6048000)
    })
  },
  [type.USER_INFO] (state, payload) {
    copyFields(state.userInfo, payload)
  },
  [type.SET_TOKEN] (state, payload) {
    state.token = payload.token
    state.refresh_token = payload.refresh_token
    Cookies.set('token', payload.token, {
      expires: CalcCookieTime(payload.expire)
    })
    Cookies.set('refresh_token', payload.refresh_token, {
      expires: CalcCookieTime(payload.refresh_token_expire)
    })
  },
  [type.SET_OPENID] (state, payload) {
    state.openId = payload.openId
    localStorage.setItem('openId_' + payload.mallDomain, payload.openId)
  },
  [type.ADDRESS_LIST] (state, payload) {
    payload = payload || []
    state.addressList.splice(0, state.addressList.length)
    for (let item of payload) {
      state.addressList.push(item)
    }
    if (payload.length === 0) {
      state.selectedAddress = {}
      localStorage.removeItem('selectedAddress')
    }
  },
  [type.SELETC_ADDRESS] (state, payload) {
    if (!payload) {
      state.selectedAddress = {}
      localStorage.removeItem('selectedAddress')
      return
    }
    state.selectedAddress = payload
    localStorage.setItem('selectedAddress', JSON.stringify(payload))
  },
  [type.LOG_OUT] () {
    Cookies.remove('mallId')
    Cookies.remove('refresh_token')
    Cookies.remove('token')
    window.location.reload()
  },
  [type.SET_AVATAR] (state, payload) {
    state.userInfo.img = payload
  },
  [type.SET_USERNAME] (state, payload) {
    state.userInfo.userName = payload
  },
  [type.GET_CART_COUNT] (state, payload) {
    state.cartCount = payload
  },
  [type.Get_ADUIT_NOTICE] (state, payload) {
    state.aduitNotice = payload
  },
  [type.STUDENTS] (state, payload) {
    state.students = payload
  }
}
