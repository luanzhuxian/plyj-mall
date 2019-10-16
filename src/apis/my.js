import { axios } from '../assets/js/axios'
export const getNewFreight = () => axios.get('/apis/v1/order/logistics/order/waitReceive')
/**
 * 获取优惠券列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getAvailableCouponList = () => axios.get('/apis/v1/coupon/center/list')
/**
 * 领取优惠券(系统发放的优惠券
 * @returns {Promise<AxiosResponse<T>>}
 */
export const receiveCoupon = (couponId) => axios.post(`/apis/v1/coupon/receive?couponId=${couponId}`)

/**
 * 获取已领取优惠券列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getMyCouponList = () => axios.get('/apis//v1/coupon/me/list')
