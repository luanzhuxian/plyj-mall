import { axios } from '../assets/js/axios'

// 获取好友晒单列表
export const getObtainedSunPresentList = (id, current, size) => axios.get(`/apis/v1/signinActivity/customer/${id}/flaunt_awards?current=${current}&size=${size}`)

// 获取奖品列表
export const getPresentList = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/ultimate_award`)

// 获取签到图标列表
export const getSignInIconList = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/my_signin_info`)

// 签到
export const checkInCurrentNewYearIcon = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/my_signin_info`)

// 领取奖品
export const receivePresent = (id) => axios.get(`/apis/v1/signinActivity/customer/${id}/my_signin_info`)
