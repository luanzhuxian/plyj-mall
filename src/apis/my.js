import axios from 'axios'
export const getNewFreight = () => axios.get('/apis/v1/order/logistics/order/waitReceive')
/**
 * 领取优惠券(系统发放的优惠券
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getCoupon = () => axios.post('/apis/v1/coupon/receive')
