import * as type from './mutation-type.js'
import {
  getMallInfo,
  getOpenId,
  getUserInfo,
  login,
  refreshToken,
  getCartCount
} from '../apis/base-api'
import {
  getAddress
} from '../apis/address'
import {
  getList
} from '../apis/student'
import {
  getAduitNotice
} from '../apis/broker-manager'
import {
  DelayExec
} from '../assets/js/util'
import Qs from 'qs'
let delay = new DelayExec(500)
export default {
  /* 获取商城信息 */
  [type.GET_MALL_INFO]: ({ commit, dispatch }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 商城名称
        let mallDomain = window.location.pathname.split('/')[1] || ''
        const { result } = await getMallInfo(mallDomain)
        commit(type.GET_MALL_INFO, result)
        // 获取本地缓存openId
        let openId = localStorage.getItem(`openId_${mallDomain}`) || ''
        // 如果openId不存在，获取一下openId
        if (!openId) {
          await dispatch(type.GET_OPENID)
        } else {
          commit(type.SET_OPENID, { mallDomain, openId })
        }
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  // 获取openid并登录
  [type.GET_OPENID]: ({ commit, dispatch, state }) => {
    return new Promise(async (resolve, reject) => {
      let search = Qs.parse(location.search.substring(1))
      let appId = state.mallInfo.appid
      let component_appid = '1'
      try {
        if (search.code) {
          // 微信
          const { result } = await getOpenId(appId, search.code)
          commit(type.SET_OPENID, { mallDomain: state.mallInfo.mallDomain, openId: result.OPEN_ID })
          resolve()
        } else {
          // `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.href}&response_type=code&scope=SCOPE&state=STATE&component_appid=${component_appid}#wechat_redirect`
          window.location.replace(openIdUrl)
        }
      } catch (e) {
        if (e.message.indexOf('code') > -1) { // 如果code无效重新登录
          let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.href}&response_type=code&scope=SCOPE&state=STATE&component_appid=${component_appid}#wechat_redirect`
          // let openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${location.href.split('?')[0]}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.replace(openIdUrl)
        } else {
          reject(e)
        }
      }
    })
  },
  [type.LOGIN]: ({ commit, dispatch, state }) => {
    return new Promise(async (resolve, reject) => {
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
        let { result } = await getUserInfo()
        commit(type.USER_INFO, result)
        await dispatch(type.ADDRESS_LIST)
        localStorage.setItem('refresh_count', 0)
        resolve(result)
      } catch (e) {
        /*
        * 获取用户信息失败,可能原因： token失效
        * 所以不要第一时间抛错， 尝试刷新一次token，如果刷新失败，再抛错
        * */
        try {
          await dispatch(type.REFRESH_TOKEN)
          resolve(e)
        } catch (e) {
          reject(e)
        }
      }
    })
  },
  [type.ADDRESS_LIST]: ({ commit }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getAddress()
        commit(type.ADDRESS_LIST, result)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.REFRESH_TOKEN]: ({ commit, state, dispatch }) => {
    return new Promise(async (resolve, reject) => {
      let refreshCount = sessionStorage.getItem('refresh_count') || 0
      sessionStorage.setItem('refresh_count', (refreshCount + 1))
      // refresh_token 连续刷三次以上时，说明存在异常，退出重新登录
      if (Number(refreshCount) > 3) {
        sessionStorage.setItem('refresh_count', 0)
        commit(type.LOG_OUT)
        return
      }
      try {
        if (state.refresh_token) {
          await delay.exec()
          let { result } = await refreshToken(state.refresh_token)
          commit(type.SET_TOKEN, result)
          await dispatch(type.USER_INFO)
          sessionStorage.setItem('refresh_count', 0)
        } else {
          commit(type.LOG_OUT)
        }
        resolve()
      } catch (e) {
        // refresh_token失效
        commit(type.LOG_OUT)
        reject(e)
      }
    })
  },
  [type.GET_CART_COUNT]: ({ commit }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { result } = await getCartCount()
        commit(type.GET_CART_COUNT, result)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  [type.Get_ADUIT_NOTICE]: async ({ commit }) => {
    try {
      const { result } = await getAduitNotice()
      commit(type.Get_ADUIT_NOTICE, result)
    } catch (e) {
      throw e
    }
    // return new Promise(async (resolve, reject) => {
    //   try {
    //
    //     resolve()
    //   } catch (e) {
    //     reject(e)
    //   }
    // })
  },
  [type.STUDENTS]: async ({ commit }, params) => {
    try {
      const { result } = await getList(params)
      commit(type.STUDENTS, result.records)
      return result.records
    } catch (e) {
      throw e
    }
  }
}
