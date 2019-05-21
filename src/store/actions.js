import * as type from './mutation-type.js'
import {
  getMallInfo,
  getOpenId,
  getUserInfo,
  login,
  refreshToken
  // getPenglaiAppid
} from '../apis/base-api'
import {
  getAddress
} from '../apis/address'
import Qs from 'qs'
export default {
  /* 获取商城信息 */
  [type.GET_MALL_INFO]: ({ commit, dispatch }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let domainName = window.location.pathname.split('/')[1] || ''
        const { result } = await getMallInfo(domainName)
        commit(type.GET_MALL_INFO, result)
        let mallSeq = result.sequenceNbr
        let openId = localStorage.getItem(mallSeq)
        console.warn('openId: ', openId)
        console.warn('mallSeq: ', mallSeq)
        if (!openId) {
          console.warn('获取openid')
          // 如果openid不存在，获取一下opendId
          await dispatch(type.GET_OPENID)
          return
        } else {
          commit(type.SET_OPENID, { mallSeq, openId })
        }
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.GET_OPENID]: ({ commit, dispatch, state }) => {
    console.warn('获取openid.....')
    return new Promise(async (resolve, reject) => {
      let search = Qs.parse(location.search.substring(1))
      let appId = state.mallInfo.appid
      try {
        if (search.code) {
          // 微信
          const wechatData = await getOpenId(appId, search.code)
          console.warn('获取openid成功：', wechatData)
          commit(type.SET_OPENID, { mallSeq: state.mallInfo.sequenceNbr, openId: wechatData.result.OPEN_ID })
          // 拿到 openId 后，直接登录
          await dispatch(type.LOGIN)
        } else {
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        }
      } catch (e) {
        if (e.message.indexOf('code') > -1) { // 如果code无效重新登录
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${location.href.split('?')[0]}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        } else {
          reject(e)
        }
      }
    })
  },
  [type.LOGIN]: ({ commit, dispatch, state, getters }, openId) => {
    return new Promise(async (resolve, reject) => {
      console.warn('登录...')
      try {
        let loginInfo = null
        // 通过openid登录
        if (state.openId) {
          loginInfo = await login(state.openId)
        } else {
          // openid有问题时重新获取openid
          dispatch(type.GET_OPENID)
          return
        }
        commit(type.SET_TOKEN, loginInfo.result)
        // 用户信息
        const USERINFO = await getUserInfo()
        commit(type.USER_INFO, USERINFO.result)
        // 用户地址列表
        await dispatch(type.ADDRESS_LIST)
        resolve(loginInfo)
      } catch (e) {
        dispatch(type.GET_OPENID)
        reject(e)
      }
    })
  },
  [type.USER_INFO]: ({ commit, dispatch, getters }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dispatch(type.GET_MALL_INFO)
        let { result } = await getUserInfo()
        commit(type.USER_INFO, result)
        await dispatch(type.ADDRESS_LIST)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.ADDRESS_LIST]: ({ commit }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getAddress()
        commit(type.ADDRESS_LIST, result)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.REFRESH_TOKEN]: ({ commit, state, dispatch }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (state.refresh_token) {
          let { result } = await refreshToken(state.refresh_token)
          commit(type.SET_TOKEN, result)
          await dispatch(type.USER_INFO)
        } else {
          await dispatch(type.LOGIN)
        }
        resolve()
      } catch (e) {
        // refresh_token失效
        await dispatch(type.LOGIN)
        reject(e)
      }
    })
  }
}
