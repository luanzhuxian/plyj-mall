import { axios } from '../assets/js/axios'

// 查询知识课程列表
export const getCourseInfo = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })

// 获取知识课程列表
export const getCourse = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })

// 获取互动直播列表
export const getLiveList = params => axios.get('/apis/v1/mall/live/activity/current/list', { params })

// 获取当前用户送课列表
export const getSendLiveList = _ => axios.get('/apis/v1/mall/live/activity/giveNotice')
