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
import { getTemplate, getSkinStatus } from '../apis/home'
import {
    DelayExec,
    loadImage
} from '../assets/js/util'
import { upload } from '../assets/js/upload-image'
import Cookie from '../assets/js/storage-cookie'
import Qs from 'qs'
import MessageBox from '../components/penglai-ui/message-box'
const delay = new DelayExec(500)

const getWeixinURL = (appSecret, appId, componentAppid, search) => {
    let openIdUrl = ''
    const href = `${ location.protocol }//${ location.host }${ location.pathname }`
    if (appSecret) {
        openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ appId }&redirect_uri=${ href }?${ Qs.stringify(search) }&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    } else {
        openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ appId }&redirect_uri=${ href }?${ Qs.stringify(search) }&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=${ componentAppid }#wechat_redirect`
    }
    return openIdUrl
}
export default {

    /* 获取商城信息 */
    [type.GET_MALL_INFO]: async ({ commit, dispatch }) => {
        try {
            // 商城名称
            const mallDomain = window.location.pathname.split('/')[1] || ''
            const { result } = await getMallInfo(mallDomain)
            commit(type.GET_MALL_INFO, result)
            console.log(result)

            // 获取本地缓存openId
            // const openId = localStorage.getItem(`openId_${ mallDomain }`) || ''

            // 如果openId不存在，获取一下openId
            // if (!openId) {
            //     await dispatch(type.GET_OPENID)
            // } else {
            // }
            // commit(type.SET_OPENID, { mallDomain, openId })
            return result
        } catch (e) {
            throw e
        }
    },

    // 获取openid并登录
    [type.GET_OPENID]: async ({ commit, dispatch, state }) => {
        const { appSecret, mallDomain, componentAppid } = state.mallInfo
        const OPEN_ID = localStorage.getItem(`openId_${ mallDomain }`) || ''
        if (OPEN_ID) return OPEN_ID
        const search = Qs.parse(location.search.substring(1)) || {}
        const appId = state.mallInfo.appid
        try {
            if (search.code) {
                // 微信
                const { result } = await getOpenId(appId, search.code)
                commit(type.SET_OPENID, { mallDomain: state.mallInfo.mallDomain, openId: result.OPEN_ID })
                return result.OPEN_ID
            }
            location.replace(getWeixinURL(appSecret, appId, componentAppid, search))
        } catch (e) {
            if (e.message.indexOf('code') > -1) {
                MessageBox.confirm('微信登录失败，是否重试？')
                    .then(() => {
                        delete search.code
                        location.replace(getWeixinURL(appSecret, appId, componentAppid, search))
                    })
                    .catch(() => {
                        window.wx.closeWindow()
                    })
            } else {
                throw e
            }
        }
    },
    [type.LOGIN]: async ({ commit, dispatch, state }, openId) => {
        try {
            const loginInfo = await login(openId)
            commit(type.SET_TOKEN, loginInfo.result)
            return loginInfo
            // let loginInfo = null
            //
            // // 通过openid登录
            // if (state.openId) {
            //     loginInfo = await login(state.openId)
            // } else {
            //     // openid有问题时重新获取openid
            //     await dispatch(type.GET_OPENID)
            // }
            // if (loginInfo) {
            //     commit(type.SET_TOKEN, loginInfo.result)
            // }
            // return loginInfo
        } catch (e) {
            throw e
        }
    },

    // 转存微信头像到ali-oss，以便提高生成海报的速度
    [type.SAVE_WX_AVATAR]: async ({ commit }, url) => {
        const img = await loadImage(url)
        const cvs = document.createElement('canvas')
        cvs.width = img.naturalWidth
        cvs.heigt = img.naturalHeight
        const ctx = cvs.getContext('2d')
        ctx.drawImage(img, 0, 0)
        cvs.toBlob(async blob => {
            const res = await upload(blob)
            userInfoSettings({ headImgUrl: res.url })
                .then(() => {
                    commit(type.SET_AVATAR, res.url)
                })
        }, 'image/jpeg')
    },
    [type.USER_INFO]: ({ commit, dispatch, getters }) => new Promise(async (resolve, reject) => {
        try {
            const { result } = await getUserInfo()
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
    }),
    [type.ADDRESS_LIST]: ({ commit }) => new Promise(async (resolve, reject) => {
        try {
            const { result } = await getAddress()
            commit(type.ADDRESS_LIST, result)
            resolve(result)
        } catch (e) {
            reject(e)
        }
    }),
    [type.REFRESH_TOKEN]: ({ commit, state, dispatch }) => new Promise(async (resolve, reject) => {
        const refreshCount = Number(sessionStorage.getItem('refresh_count') || 0)
        const refresh_token = Cookie.get('refresh_token')
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
                const { result } = await refreshToken(refresh_token)
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
    }),
    [type.GET_CART_COUNT]: ({ commit }) => new Promise(async (resolve, reject) => {
        try {
            const { result } = await getCartCount()
            commit(type.GET_CART_COUNT, result)
            resolve()
        } catch (e) {
            reject(e)
        }
    }),
    [type.Get_ADUIT_NOTICE]: async ({ commit }) => {
        try {
            const { result } = await getAduitNotice()
            commit(type.Get_ADUIT_NOTICE, result)
        } catch (e) {
            throw e
        }
    },
    [type.STUDENTS]: async ({ commit }, params) => {
        try {
            const { result } = await getList(params)
            commit(type.STUDENTS, result.records)
            return result.records
        } catch (e) {
            throw e
        }
    },
    [type.GET_ACTIVITY_DATA]: async ({ commit }, params) => {
        try {
            let { result } = await getTemplate({ type: 2 })
            // 没有装修主会场, 将模板id置0
            result = result || { type: 0 }
            commit(type.GET_ACTIVITY_DATA, result)
            commit(type.SET_CURRENT_TIME, result.currentTime || Date.now())
            return result
        } catch (e) {
            throw e
        }
    },
    [type.GET_SKIN_ID]: async ({ commit }, params) => {
        try {
            const { result } = await getSkinStatus({ type: 1 })
            commit(type.GET_SKIN_ID, result)
            return result
        } catch (e) {
            commit(type.GET_SKIN_ID, 0)
            throw e
        }
    }
}
