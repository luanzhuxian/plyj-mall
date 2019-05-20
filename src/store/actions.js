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
  [type.GET_MALL_INFO]: ({ commit }, payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        let domainName = window.location.pathname.split('/')[1] || ''
        const { result } = await getMallInfo(domainName)
        commit(type.GET_MALL_INFO, result)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.LOGIN]: ({ commit, dispatch }, payload) => {
    return new Promise(async (resolve, reject) => {
      let search = Qs.parse(location.search.substring(1))
      // 商城信息
      let { appid, agencyCode } = await dispatch(type.GET_MALL_INFO)
      try {
        if (search.code) {
          // 微信
          const wechatData = await getOpenId(appid, search.code)
          // 登录授权
          let loginInfo = await login(wechatData.result.OPEN_ID)
          console.log(loginInfo)
          console.log(loginInfo.result)
          commit(type.SET_TOKEN, loginInfo.result.token)
          // 用户信息
          let { result } = await getUserInfo()
          // 用户地址列表
          await dispatch(type.ADDRESS_LIST, Object.assign(result, { agencyCode }))
          commit(type.USER_INFO, Object.assign(result, payload))
          resolve(loginInfo)
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
  [type.USER_INFO]: ({ commit, dispatch, state }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await dispatch(type.GET_MALL_INFO)
        let { result } = await getUserInfo()
        commit(type.USER_INFO, result)
        await dispatch(type.ADDRESS_LIST, Object.assign(result, { agencyCode: state.mallInfo.agencyCode }))
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
