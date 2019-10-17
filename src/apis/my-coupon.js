import { axios } from '../assets/js/axios'

// C端用户查询我礼品列表
export const getCityListByParentId = (params) => axios.get(`/apis/v1/gift/me/list`, { params })

// C端用户删除我的礼品
export const deleteGift = data => axios.post('/apis/v1/gift/me/delete', data)

// 通id查看单个礼品详情
export const getGiftDetailById = (params) => axios.get(`/apis/v1/gift/id/detail`, { params })

/**
 * 获取优惠券列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getAvailableCouponList = ({ current, size }) => axios.get(`/apis/v1/coupon/center/list?current=${current}&size=${size}`)
/**
 * 领取优惠券(系统发放的优惠券
 * @returns {Promise<AxiosResponse<T>>}
 */
export const receiveCoupon = (couponId) => axios.post(`/apis/v1/coupon/receive?couponId=${couponId}`)

/**
 * 获取已领取优惠券列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getMyCouponList = ({ current, size, status }) => axios.get(`/apis/v1/coupon/me/list?current=${current}&size=${size}&status=${status}`)
/**
 * 删除优惠券
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteCouponList = (data) => axios.put('/apis/v1/coupon/me/delete', data)
/**
 * 获取最大优惠价格优惠券
 * */
export const getCouponOfMax = () => axios.get('/apis/v1/coupon/me/maxPrice')
