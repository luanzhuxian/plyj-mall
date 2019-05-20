import * as type from './mutation-type.js'
import {
  getMallInfo,
  getOpenId,
  getUserInfo,
  login
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
        if (!openId) {
          // 如果openid不存在，获取一下opendId
          dispatch(type.GET_OPENID)
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
  [type.GET_OPENID]: ({ commit, dispatch }) => {
    return new Promise(async (resolve, reject) => {
      let search = Qs.parse(location.search.substring(1))
      let { appid, sequenceNbr } = await dispatch(type.GET_MALL_INFO)
      try {
        if (search.code) {
          // 微信
          const wechatData = await getOpenId(appid, search.code)
          commit(type.SET_OPENID, { mallSeq: sequenceNbr, openId: wechatData.result.OPEN_ID })
          // 拿到 openId 后，直接登录
          await dispatch(type.LOGIN)
        } else {
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        }
      } catch (e) {
        if (e.message.indexOf('code') > -1) { // 如果code无效重新登录
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${location.href.split('?')[0]}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        } else {
          reject(e)
        }
      }
    })
  },
  [type.LOGIN]: ({ commit, dispatch, state, getters }, openId) => {
    return new Promise(async (resolve, reject) => {
      let loginInfo = await login(state.openId)
      commit(type.SET_TOKEN, loginInfo.result)
      // 用户信息
      let { result } = await getUserInfo()
      // 用户地址列表
      await dispatch(type.ADDRESS_LIST)
      commit(type.USER_INFO, Object.assign(result))
      resolve(loginInfo)
    })
  },
  [type.USER_INFO]: ({ commit, dispatch, getters }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dispatch(type.GET_MALL_INFO)
        let { result } = await getUserInfo()
        commit(type.USER_INFO, result)
        await dispatch(type.ADDRESS_LIST, Object.assign(result, { agencyCode: getters.agencyCode }))
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.ADDRESS_LIST]: ({ commit, state }, { agencyCode }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getAddress({ agencyCode, mallSeq: state.mallInfo.sequenceNbr })
        commit(type.ADDRESS_LIST, result)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
  // 朋来APPId
  // [type.GET_PL_APPID]: ({ commit, state }, { agencyCode }) => {
  //   return new Promise()
  // }
}
