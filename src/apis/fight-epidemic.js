import { axios } from '../assets/js/axios'
/**
 * 获取战报详情
 * @param id {string} 数据
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getReportDetail = id => axios.get(`/apis/v1/epidemicInformation/detail/${id}`)

// 查询该机构的战报活动
export const getReportActivity = () => axios.get('/apis/v1/epidemicInformation')

// 查询该机构的志愿书活动
export const getBookActivity = () => axios.get('/apis/v1/epidemic/has_epidem_activity')
// 报名
export const signUp = data => axios.post('/apis/v1/epidemicActivity/signUp', data)
// 报名数据
export const signInfo = activityId => axios.get(`/apis/v1/epidemicActivity/querySignUpInfo/${activityId}`)

// 疫情签到的活动信息
export const getactivityInfo = activityId => axios.get(`/apis/v1/epidemic/epidem_activity/${activityId}`)

// 我的签到信息
export const getSignInInfo = activityId => axios.get(`/apis/v1/epidemic/my_sign_info/${activityId}`)

// 抗疫签到
export const signIn = ({ activityId, content }) => axios.post(`/apis/v1/epidemic/signin/${activityId}`, null, { params: { content } })

// 抗疫弹幕
export const getBarrage = activityId => axios.get(`/apis/v1/epidemic/new_signin_notices/${activityId}`)

// 获取兑换礼品信息
export const getGiftInfo = (activityId, userId) => axios.get(`/apis/v1/epidemicActivity/my_gift_info/${activityId}`, { params: { userId } })

// 兑换礼品
export const reedemGift = ({ activityId, userId, giftId }) => axios.get(`/apis/v1/epidemicActivity/reedemGift/${activityId}`, { params: { userId, giftId } })
