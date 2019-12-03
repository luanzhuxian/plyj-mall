import * as type from './mutation-type.js'
import {
  getMallInfo,
  getOpenId,
  getUserInfo,
  login,
  refreshToken,
  getCartCount,
  userInfoSettings
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
  DelayExec,
  loadImage
} from '../assets/js/util'
import { upload } from '../assets/js/upload-image'
import Cookie from '../assets/js/storage-cookie'
import Qs from 'qs'
import MessageBox from '../components/penglai-ui/message-box'
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
  [type.GET_OPENID]: async ({ commit, dispatch, state }) => {
    let search = Qs.parse(location.search.substring(1)) || {}
    let appId = state.mallInfo.appid
    let componentAppid = state.mallInfo.componentAppid
    let appSecret = state.mallInfo.appSecret
    try {
      if (search.code) {
        // 微信
        const { result } = await getOpenId(appId, search.code)
        commit(type.SET_OPENID, { mallDomain: state.mallInfo.mallDomain, openId: result.OPEN_ID })
        return result
      } else {
        location.replace(getWeixinURL(appSecret, appId, componentAppid, search))
      }
    } catch (e) {
      if (e.message.indexOf('code') > -1) {
        MessageBox.confirm('微信登录失败，是否重试？')
          .then(() => {
            delete search.code
            location.replace(getWeixinURL(appSecret, appId, componentAppid, search))
          })
          .catch(() => {})
      } else {
        throw e
      }
    }
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
          await dispatch(type.GET_OPENID)
        }
        commit(type.SET_TOKEN, loginInfo.result)
        resolve(loginInfo)
      } catch (e) {
        reject(e)
      }
    })
  },
  // 转存微信头像到ali-oss，以便提高生成海报的速度
  [type.SAVE_WX_AVATAR]: async ({ commit }, url) => {
    let img = await loadImage(url)
    let cvs = document.createElement('canvas')
    cvs.width = img.width
    cvs.heigt = img.width
    let ctx = cvs.getContext('2d')
    ctx.drawImage(img, 0, 0)
    cvs.toBlob(async blob => {
      let res = await upload(blob)
      userInfoSettings({ headImgUrl: res.url })
        .then(() => {
          commit(type.SET_AVATAR, res.url)
        })
    }, 'image/jpeg')
  },
  [type.USER_INFO]: ({ commit, dispatch, getters }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { result } = await getUserInfo()
        commit(type.USER_INFO, result)
        await dispatch(type.ADDRESS_LIST)
        localStorage.setItem('refresh_count', 0)
        // 如果用户头像是微信那边的，那就转存至ali-oss
        if (result.img.indexOf('qlogo') > -1) {
          dispatch(type.SAVE_WX_AVATAR, result.img)
        }
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
      let refreshCount = Number(sessionStorage.getItem('refresh_count') || 0)
      let refresh_token = Cookie.get('refresh_token')
      sessionStorage.setItem('refresh_count', (refreshCount + 1))
      // refresh_token 连续刷三次以上时，说明存在异常，退出重新登录
      if (Number(refreshCount) > 3) {
        sessionStorage.setItem('refresh_count', 0)
        commit(type.LOG_OUT)
        await dispatch(type.LOGIN)
        return
      }
      try {
        if (refresh_token) {
          await delay.exec()
          let { result } = await refreshToken(refresh_token)
          commit(type.SET_TOKEN, result)
          await dispatch(type.USER_INFO)
          sessionStorage.setItem('refresh_count', 0)
        } else {
          commit(type.LOG_OUT)
          await dispatch(type.LOGIN)
        }
        resolve()
      } catch (e) {
        // refresh_token失效
        commit(type.LOG_OUT)
        await dispatch(type.LOGIN)
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
function getWeixinURL (appSecret, appId, componentAppid, search) {
  let openIdUrl = ''
  let href = `${location.protocol}//${location.host}${location.pathname}`
  if (appSecret) {
    openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${href}?${Qs.stringify(search)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
  } else {
    openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${href}?${Qs.stringify(search)}&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=${componentAppid}#wechat_redirect`
  }
  return openIdUrl
}
