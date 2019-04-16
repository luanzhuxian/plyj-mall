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
  [type.LOGIN]: ({ commit, getters, dispatch }, payload) => {
    return new Promise(async (resolve, reject) => {
      let search = Qs.parse(location.search.substring(1))
      try {
        if (search.code) {
          const wechatData = await getOpenId(getters.appId, search.code)
          let loginInfo = await login(wechatData.result.OPEN_ID)
          commit(type.SET_TOKEN, loginInfo.result.token)
          commit(type.USER_INFO, Object.assign(wechatData, loginInfo))
          window.location.replace(location.href.split('?')[0])
          resolve()
        } else {
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${getters.appId}&redirect_uri=${window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        }
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.USER_INFO]: ({ commit, dispatch, state }, payload = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getUserInfo()
        commit(type.USER_INFO, Object.assign(result, payload))
        await dispatch(type.ADDRESS_LIST, Object.assign(result, { agencyCode: state.mallInfo.agencyCode }))
        resolve(result)
      } catch (e) {
        if (e.message.indexOf('登录信息') > -1) {
          // 再次登录
          commit(type.LOG_OUT)
          dispatch(type.LOGIN)
        }
        reject(e)
      }
    })
  },
  [type.ADDRESS_LIST]: ({ commit, state }, { agencyCode }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getAddress(agencyCode)
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
