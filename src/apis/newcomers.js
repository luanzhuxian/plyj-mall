import { axios } from '../assets/js/axios'

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
 * 获取当前新人有礼活动列表
 * @return {*}
 */
export const getNewUserInfoList = () => axios.get(`/apis/v2/c/newcomerActivitys/currActiviy`)
