import axios from 'axios'

export const getNewcomersDetail = id => axios.get(`/apis/v1/newcomerActivitys/${ id }`)

export const claimCoupons = (activityId, couponIds) => axios.post(`/apis/v1/coupon/oneKey/receive`, [
    ...couponIds
], {
    params: {
        activityId,
        entityClassName: 'MallNewcomerActivityEntity'
    }
})

export const getCurrentActivity = () => axios.get(`/apis/v1/newcomerActivitys/currActiviy`)

export const registerStatisitic = activityId => axios.post(`/apis/v1/mallActivitys/${ activityId }/register/stat`)

/**
 * 获取当前进行中的新人有礼活动列表
 * @return {*}
 */
export const getGoingInfo = () => axios.get(`/apis/v2/c/newcomerActivitys/currActiviy`)

/**
 * 根据活动id获取新人有礼详情
 * @return {*}
 */
export const getInfoById = id => axios.get(`/apis/v2/c/newcomerActivitys/${ id }`)

/**
 * 一键全部领取活动 礼物、优惠券、奖学金
 * @param activityId {string}
 * @param shareUserId {string}
 * @return {*}
 */
export const akeyToGet = (activityId, shareUserId) => axios.post(`/apis/v2/c/newcomerActivitys/${ activityId }/claim/all`, { shareUserId })

/**
 * 判断是否为新人
 * @param activityId {string}
 * @return {*}
 */
export const isNewUser = activityId => axios.get(`/apis/v2/c/newcomerActivitys/${ activityId }/isNewUser`)
