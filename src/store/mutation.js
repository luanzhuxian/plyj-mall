import * as type from './mutation-type'
import Cookie from '../assets/js/storage-cookie'
import { copyFields } from '../assets/js/util'
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

        // 存储上一个商城的id
        localStorage.setItem('lastMallId', Cookie.get('mallId'))

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
            localStorage.removeItem('selectedAddress')
        }
    },
    [type.SELETC_ADDRESS] (state, payload) {
        if (!payload) {
            state.selectedAddress = {}
            localStorage.removeItem('selectedAddress')
            return
        }
        state.selectedAddress = payload
        localStorage.setItem('selectedAddress', JSON.stringify(payload))
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
    [type.GET_SKIN_ID] (state, payload) {
        state.skinId = payload || 0
    },
    [type.SET_LIVE_INFO] (state, payload) {
        state.liveInfo = payload || {}
    },
    [type.SET_COURSE_INFO] (state, payload) {
        state.courseInfo = payload || {}
    },
    [type.SET_COUPON_INFO] (state, payload) {
        state.d12CouponTotal = payload.doubleTwelveCount || 0
        state.xinchunCouponTotal = payload.newYearCount || 0
    },
    [type.SET_INVITING_EVENT] (state, payload) {
        state.invitingEvent = payload || {}
    },
    [type.SET_JX_EVENT] (state, payload) {
        state.jxEvent = payload || {}
    },
    [type.SET_NW_EVENT] (state, payload) {
        state.nwEvent = payload && payload.length ? payload[0] : {}
    },
    [type.SET_CAMPAIGN_REPORT] (state, payload) {
        state.campaignReport = payload
    },
    [type.SET_CAMPAIGN_BOOK] (state, payload) {
        state.campaignBook = payload
    },
    [type.SET_CURRENT_TIME] (state, payload) {
        state.currentTime = payload
    },
    [type.SET_SHARE_ID] (state, brokerId) {
        const {
            roleCode,
            userId
        } = state.userInfo
        // 缓存分享人的id，sessionStorage中的shareBrokerId在提交订单的时候会携带上
        // 企业管理员，高级管理员，子账号进入页面时使用自己的id作为分享id
        if (roleCode === 'EMPLOYEE' || roleCode === 'ADMIN' || roleCode === 'ENTERPRISE_ADMIN') {
            state.SHARE_ID = userId
        } else {
            state.SHARE_ID = brokerId || userId || null
        }
        sessionStorage.setItem('SHARE_ID', state.SHARE_ID)
    }
}
