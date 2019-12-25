import { axios } from '../assets/js/axios'

/** *******************************************************我心中的年味***************************************************************/
// 检测当前活动是否可参与
export const checkIsParticipateableActivity = (id) => axios.get(`/apis/v1/signinActivity/customer/may_share_join_activity/${id}`)

// 获取好友晒单列表
export const getObtainedSunPresentList = (id, current, size) => axios.get(`/apis/v1/signinActivity/customer/${id}/flaunt_awards?current=${current}&size=${size}`)

// 获取奖品列表
export const getPresentList = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/ultimate_award`)

// 获取签到图标列表
export const getSignInIconList = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/my_signin_info`)

// 签到
export const checkInCurrentNewYearIcon = (id, signinNote) => axios.post(`/apis/v1/signinActivity/customer/${id}/signin?signinNote=${signinNote}`)

// 领取奖品
export const receivePresent = (id, signinNote) => axios.post(`/apis/v1/signinActivity/customer/${id}/luck_draw/${signinNote}`)

// 统计访问量
export const statisticsViews = (id) => axios.get(`/apis/v1/signinActivity/incrAccess/${id}`)

/** *******************************************************新人有礼***************************************************************/

// 获取当前新人有礼的活动
export const getCurrentActivity = () => axios.get(`/apis/v1/newcomerActivitys/currActiviy`)

// 获取新人有礼的活动详情
export const getNewcomersDetail = (id) => axios.get(`/apis/v1/newcomerActivitys/${id}`)
