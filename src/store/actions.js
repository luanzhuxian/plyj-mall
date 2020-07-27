import * as type from './mutation-type.js'
import {
    getMallInfo,
    getOpenId,
    getUserInfo,
    login,
    // refreshToken,
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
    // DelayExec,
    loadImage
    // promise
} from '../assets/js/util'
import { upload } from '../assets/js/upload-image'
// import Cookie from '../assets/js/storage-cookie'
import Qs from 'qs'
import MessageBox from '../components/penglai-ui/message-box'

const getWeixinURL = (appSecret, appId, componentAppid, search) => {
    let openIdUrl = ''
    let href = ''
    if (search) {
        href = `${ location.protocol }//${ location.host }${ location.pathname }?${ Qs.stringify(search) }`
    } else {
        href = `${ location.protocol }//${ location.host }${ location.pathname }`
    }
    if (appSecret) {
        openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ appId }&redirect_uri=${ href }&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    } else {
        openIdUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ appId }&redirect_uri=${ href }&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=${ componentAppid }#wechat_redirect`
    }
    return openIdUrl
}

/**
 * 处理链接search
 * 可以处理链接中包含多个问号的情况
 */
const parseSearch = () => {
    const searchArr = location.search.split('?')
    let search = {}
    for (const val of searchArr) {
        search = { ...search, ...Qs.parse(val) }
    }
    return search
}

export default {

    /* 获取商城信息 */
    [type.GET_MALL_INFO]: async ({ commit, dispatch }) => {
        try {
            // 商城名称
            const mallDomain = window.location.pathname.split('/')[1] || ''
            const { result } = await getMallInfo(mallDomain)
            commit(type.GET_MALL_INFO, result)
            return result
        } catch (e) {
            throw e
        }
    },

    // 获取openid并登录
    [type.GET_OPENID]: async ({ commit, dispatch, state }) => {
        const { appSecret, mallDomain, componentAppid, appid: appId } = state.mallInfo
        if (!appId) {
            throw new Error('商城还未授权给雅集')
        }
        const OPEN_ID = localStorage.getItem(`openId_${ mallDomain }`) || ''
        if (OPEN_ID) {
            commit(type.SET_OPENID, { mallDomain, openId: OPEN_ID })
            return OPEN_ID
        }
        const search = parseSearch()
        try {
            if (search.code) {
                // 微信
                const { result } = await getOpenId(appId, search.code)
                commit(type.SET_OPENID, { mallDomain, openId: result.OPEN_ID })
                return result.OPEN_ID
            }
            return false
        } catch (e) {
            if (e) {
                MessageBox.confirm('微信登录失败，是否重试？')
                    .then(() => {
                        delete search.code
                        location.href = getWeixinURL(appSecret, appId, componentAppid, search)
                    })
                    .catch(() => {
                        window.wx.closeWindow()
                    })
            }
            throw e
        }
    },
    [type.LOGIN]: async ({ commit, dispatch, state }) => {
        try {
            const OPEN_ID = await dispatch(type.GET_OPENID)
            if (OPEN_ID) {
                const loginInfo = await login(OPEN_ID)
                commit(type.SET_TOKEN, loginInfo.result)
                return loginInfo
            }
            const search = parseSearch()
            delete search.code
            const { appSecret, componentAppid, appid } = state.mallInfo
            location.href = getWeixinURL(appSecret, appid, componentAppid, search)
            return null
        } catch (e) {
            throw e
        }
    },

    // 转存微信头像到ali-oss，以便提高生成海报的速度
    [type.SAVE_WX_AVATAR]: async ({ commit }, url) => {
        if (url.indexOf('mallcdn.youpenglai.com') > -1) {
            return
        }
        try {
            const img = await loadImage(url)
            const cvs = document.createElement('canvas')
            cvs.width = img.naturalWidth
            cvs.heigt = img.naturalHeight
            const ctx = cvs.getContext('2d')
            ctx.drawImage(img, 0, 0)
            cvs.toBlob(async blob => {
                const res = await upload(blob)
                await userInfoSettings({ headImgUrl: res.url })
                commit(type.SET_AVATAR, res.url)
            }, 'image/jpeg')
        } catch (e) {
            console.error(`转存微信头像失败：${ e.message }`)
        }
    },
    [type.USER_INFO]: async ({ state, commit, dispatch, getters }) => {
        try {
            const { result } = await getUserInfo()
            commit(type.USER_INFO, result)
            await dispatch(type.ADDRESS_LIST)
            // 替换微信头像文件地址
            dispatch(type.SAVE_WX_AVATAR, result.img)
            return result
        } catch (e) {
            throw e
        }
    },
    [type.ADDRESS_LIST]: ({ commit }) => new Promise(async (resolve, reject) => {
        try {
            const { result } = await getAddress()
            commit(type.ADDRESS_LIST, result)
            resolve(result)
        } catch (e) {
            reject(e)
        }
    }),
    // [type.REFRESH_TOKEN]: ({ commit, state, dispatch }) => new Promise(async (resolve, reject) => {
    //     const refreshCount = Number(sessionStorage.getItem('refresh_count') || 0)
    //     const refresh_token = Cookie.get('refresh_token')
    //     sessionStorage.setItem('refresh_count', String(refreshCount + 1))
    //
    //     // refresh_token 连续刷三次以上时，说明存在异常，退出重新登录
    //     if (Number(refreshCount) > 3) {
    //         sessionStorage.setItem('refresh_count', '0')
    //         commit(type.LOG_OUT)
    //         await dispatch(type.LOGIN)
    //         return
    //     }
    //     try {
    //         if (refresh_token) {
    //             // const delay = new DelayExec(500)
    //             // await delay.exec()
    //             const { result } = await refreshToken(refresh_token)
    //             commit(type.SET_TOKEN, result)
    //             await dispatch(type.USER_INFO)
    //             // sessionStorage.setItem('refresh_count', 0)
    //         } else {
    //             commit(type.LOG_OUT)
    //             await dispatch(type.LOGIN)
    //         }
    //         resolve()
    //     } catch (e) {
    //         // refresh_token失效
    //         commit(type.LOG_OUT)
    //         try {
    //             const SUCCESS = await dispatch(type.LOGIN)
    //             if (SUCCESS) {
    //                 resolve()
    //             } else {
    //                 reject(e)
    //             }
    //         } catch (e) {
    //             reject(e)
    //         }
    //     }
    // }),
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
