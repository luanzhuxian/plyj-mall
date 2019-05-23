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
    console.warn(`/${payload.mallSeq}/`, state.openId)
    state.openId = payload.openId
    // openid根据不同的商城来区分
    Cookie.set('openId', payload.openId, {
      expires: CalcCookieTime(604800),
      path: `/${payload.mallSeq}`
    })
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
  }
}
