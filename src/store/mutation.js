import * as type from './mutation-type'
import Cookie from '../assets/js/storage-cookie'
import { copyFields } from '../assets/js/util'
import { setUser, setTags } from '@sentry/browser'
const { VUE_APP_MODEL, NODE_ENV } = process.env
// 本地cookie较服务器提前一小时过期
const CalcCookieTime = expire => new Date(Date.now() + expire * 1000 - 3600000)
export default {
    [type.SET_THEME] (state, theme) {
        state.theme = theme
        document.body.id = theme
    },
    [type.GET_MALL_INFO] (state, payload) {
        copyFields(state.mallInfo, payload)
        sessionStorage.setItem('mallName', payload.mallName)
        // 缓存10周
        Cookie.set('mallId', payload.id, {
            expires: CalcCookieTime(6048000)
        })
        Cookie.set('agencyCode', payload.enterpriseId, {
            expires: CalcCookieTime(6048000)
        })
    },
    [type.USER_INFO] (state, payload) {
        copyFields(state.userInfo, payload)

        // 向sentry设置用户信息，以便在日志中展示
        // 只有生产环境
        if (VUE_APP_MODEL === NODE_ENV) {
            const { mallName, sequenceNbr: mallId, mallDomain, appId } = state.mallInfo
            // 用户信息搜索只支持以下两个字段
            setUser({
                id: payload.userId,
                username: payload.userName
            })
            // 添加标签，以便搜索
            setTags({
                mallDomain,
                mallName,
                mallId,
                appId,
                mobile: payload.mobile,
                openId: payload.openId,
                realName: payload.realName
            })
        }
    },
    [type.SET_TOKEN] (state, payload) {
        Cookie.set('token', payload.token, {
            expires: CalcCookieTime(payload.expire)
        })
        Cookie.set('refresh_token', payload.refresh_token, {
            expires: CalcCookieTime(payload.refresh_token_expire)
        })
    },
    [type.SET_OPENID] (state, payload) {
        state.openId = payload.openId
        localStorage.setItem(`openId_${ payload.mallDomain }`, payload.openId)
    },
    [type.ADDRESS_LIST] (state, payload) {
        payload = payload || []
        state.addressList.splice(0, state.addressList.length)
        for (const item of payload) {
            state.addressList.push(item)
        }
        if (payload.length === 0) {
            state.selectedAddress = {}
            sessionStorage.removeItem('selectedAddress')
        }
    },
    [type.SELETC_ADDRESS] (state, payload) {
        if (!payload) {
            state.selectedAddress = {}
            sessionStorage.removeItem('selectedAddress')
            return
        }
        state.selectedAddress = payload
        sessionStorage.setItem('selectedAddress', JSON.stringify(payload))
    },
    [type.LOG_OUT] () {
        Cookie.remove('mallId')
        Cookie.remove('refresh_token')
        Cookie.remove('token')
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
    },
    [type.GET_ACTIVITY_DATA] (state, payload) {
        state.activityData = payload
    },
    [type.GET_SKIN_ID] (state, payload = 0) {
        state.skinId = payload
    },
    [type.SET_LIVE_INFO] (state, payload = {}) {
        state.liveInfo = payload
    },
    [type.SET_COUPON_INFO] (state, payload = 0) {
        state.couponToReceive = payload
    },
    [type.SET_NW_EVENT] (state, payload) {
        state.nwEvent = payload && payload.length ? payload[0] : {}
    },
    [type.SET_DRAGON_GATE_CHARITY] (state, payload = {}) {
        state.dragonGateCharity = payload
    },
    [type.SET_CURRENT_SIGN] (state, payload = {}) {
        state.currentSign = payload || {}
    },
    [type.SET_CURRENT_LOTTERY] (state, payload = {}) {
        state.currentLottery = payload || {}
    },
    [type.SET_MALL_QRCODE_INFO] (state, payload = {}) {
        if (!payload) payload = {}

        const { regionScope = '' } = payload
        const array = regionScope.split(',')
        payload.isHomeDisplay = array.includes('1')
        payload.isDetailDisplay = array.includes('2')
        payload.isLiveDisplay = array.includes('3')
        state.mallQRCodeInfo = payload
    },
    [type.SET_CURRENT_TIME] (state, payload) {
        state.currentTime = payload
    },
    [type.SET_SHARE_ID] (state, brokerId) {
        const {
            roleCode,
            userId
        } = state.userInfo
        brokerId = brokerId || userId
        // 缓存分享人的id，sessionStorage中的shareBrokerId在提交订单的时候会携带上
        // 企业管理员，高级管理员，子账号,helper进入页面时使用自己的id作为分享id
        // 如果没有传递brokerId，则使用userId
        if (roleCode === 'EMPLOYEE' || roleCode === 'ADMIN' || roleCode === 'ENTERPRISE_ADMIN' || roleCode === 'HELPER') {
            state.SHARE_ID = userId
        } else {
            state.SHARE_ID = brokerId || null
        }
        sessionStorage.setItem('SHARE_ID', state.SHARE_ID)
    }
}
