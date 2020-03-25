import { axios } from '../assets/js/axios'

// 查询知识课程列表
export const getCourseInfo = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })

// 获取知识课程列表
export const getCourse = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })

// 获取互动直播列表
export const getLiveList = params => axios.get('/apis/v1/mall/live/activity/current/list', { params })

// 获取当前用户送课列表 isNotice: 0-未公告的数据 + 1-公告过但是用户未接收的数据
export const getSendLiveList = isNotice => axios.get(`/apis/v1/mall/live/activity/giveNotice?isNotice=${ isNotice }`)
