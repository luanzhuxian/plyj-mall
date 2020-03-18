import { axios } from '../assets/js/axios'

// 获取首页模块数据
export const getTemplate = params => axios.get('/apis/v1/mall/template/current', { params })

// 根据ids查询出售中的商品
export const getProduct = data => axios({ method: 'post', url: '/apis/v1/product/find/sale', data })

// 查询直播信息
// export const getLiveInfo = () => axios.get('/apis/v1/mall/live/activity/current/simplified')
export const getLiveInfo = () => axios.get('/apis/v1/mall/live/activity/current/home')

// 查询最大额度优惠券信息
export const getMaxCoupon = () => axios.get('/apis/v1/coupon/getMostPreferential')

// 见学之路活动信息
export const getJianxueInfo = () => axios.get('/apis/v1/mallCheckIn/currActivity/baseInfo')

// 新春年味活动信息
export const getNianweiInfo = () => axios.get('/apis/v1/signinActivity/customer/may_join_activity')

// 查询双十二、新春用户已领优惠券数
export const getMyCouponInfo = () => axios.get('/apis/v1/coupon/me/count')

// 查询当前皮肤
export const getSkinStatus = params => axios.get('/apis/v1/mall/template/getSkinStatus', { params })

// 主会场是否装修
// export const checkActivityAuth = () => axios.get(`/apis/v1/judgment/isUpTemplate`)
