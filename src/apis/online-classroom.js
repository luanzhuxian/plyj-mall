import { axios } from '../assets/js/axios'

// 获取知识课程列表
export const getCourse = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })

// 获取互动直播列表
export const getLiveList = params => axios.get('/apis/v1/mall/live/activity/current/list', { params })

// 获取当前用户送课列表 isNotice: 0-未公告的数据 + 1-公告过但是用户未接收的数据
export const getSendLiveList = isNotice => axios.get(`/apis/v1/mall/live/activity/giveNotice?isNotice=${ isNotice }`)

// 查询视频课程列表 单课/系列课
export const searchCourse = params => axios.get('/apis/v1/knowledgeCourse/search', { params })

/**
 * 获取图文列表
 * @param params {Object}
 * @property params.categoryId {string}
 * @property params.subCategoryId {string}
 * @property params.current {number}
 * @property params.size {number}
 * @return {*}
 */
export const getImageTextList = params => axios.get('/apis/v1/graphic/onlineClassroom', { params })
