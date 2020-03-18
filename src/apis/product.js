import { axios } from '../assets/js/axios'

// 获取商品详情
export const getProductDetail = (goodsId, productStatus) => axios.get(`/apis/v1/product/detail/${ goodsId }?source=1&productStatus=${ productStatus }`)

// 创建分享连接
export const createBrokerShare = productId => axios.post(`/apis/v1/agent/user/share/record/create`, { productId })

// C 端用户进入商品详情优惠券列表
export const getCouponInDetail = productId => axios.get(`/apis/v1/coupon/list/productDetail?productId=${ productId }`)

// C 端领取当前商品优惠券
export const receiveCoupon = couponId => axios.post(`/apis/v1/coupon/receive?couponId=${ couponId }`)

// C 端秒杀列表
export const secondActivityPage = params => axios.get('/apis/v1/seckill/activity/queryList', { params })

// C 端拼团列表
export const tuanActivityPage = params => axios.get('/apis/v1/group/buy/queryList', { params })

// C 端预购列表
export const bookActivityPage = params => axios.get('/apis/v1/pre/buy/queryList', { params })

/**
 * 活动当前用户可用优惠券列表（可用包括已领和未领）
 * @return {Promise<Object>}
 */
export const getCouponList = () => axios.get('/apis/v1/coupon/normal/list')

/**
 * 获取当前用户的可买数量
 * @param productId {string}
 * @param activityproduct {string}
 * @return {Promise<AxiosResponse<T>>}
 */
export const getCurrentLimit = (productId, activityproduct = 1) => axios.get(`/apis/v1/product/purchaseLimitNumber/${ productId }?activityproduct=${ activityproduct }`)

/**
 * 获取春耘计划组合商品
 * @param productId
 * @param activityproduct
 * @return {*}
 */
export const getSpringCombination = params => axios.get(`/apis/v1/combination/home/page`, { params })

/**
 * 获取课程详情
 * @param mallCourseId {string} 课程id
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const getCourseDetail = mallCourseId => axios.get(`/apis/v1/mall/cource/courseInfo/${ mallCourseId }`)

/**
 * 提交订单（获取订单号）
 * @param data {Object}
 * @return {*}
 */
export const submitOrderAndPay = (courseId, params) => axios.post(`/apis/v1/mall/live/order/create/course/order/${ courseId }`, params)
