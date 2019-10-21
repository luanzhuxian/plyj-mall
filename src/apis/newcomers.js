import { axios } from '../assets/js/axios'

export const getNewcomersDetail = (id) => axios.get(`/apis/v1/newcomerActivitys/${id}`)

export const claimCoupons = (activityId, couponIds) => axios.post(`/apis/v1/coupon/oneKey/receive`, [
  ...couponIds
], {
  params: {
    activityId,
    entityClassName: 'MallNewcomerActivityEntity'
  }
})

export const getCurrentActivity = () => axios.get(`/apis/v1/newcomerActivitys/currActiviy`)
