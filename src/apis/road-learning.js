import { axios } from '../assets/js/axios'

// C端根据ID查询学霸活动
export const getRoadLearningDetail = () => axios.get(`/apis/v1/mallCheckIn/currActivity/baseInfo`)

// C端用户查询学霸活动
export const getIDRoadLearningDetail = (id) => axios.get(`/apis/v1/mallCheckIn/${id}/baseInfo`)

// 获取用户签到数据-c
export const getCheckInDetail = (id) => axios.get(`/apis/v1/mallCheckIn/${id}/checkIn/userInfo`)

// 今日签到
export const getCheckIn = (id) => axios.put(`/apis/v1/mallCheckIn/${id}/checkIn`)

// 签到领取礼物
export const claimGift = (id) => axios.put(`/apis/v1/mallCheckIn/${id}/claimGift`)
