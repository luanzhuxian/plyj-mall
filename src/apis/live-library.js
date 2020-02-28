
import { axios } from '../assets/js/axios'

// 获取直播观看列表
export const getLibraryList = params => axios.get('/apis/v1/mall/live/lib/my_lookback', { params })

// 直播回放是否付过费
export const hasPied = activityId => axios.get(`/apis/v1/mall/live/lib/lookback/${activityId}`)

// 获取课程列表
export const getCourseList = params => axios.get('/apis/v1/knowledgeCourse/myVideo', { params })

// 获取观看课程信息
export const getCourseDetail = liveId => axios.get(`/apis/v1/mall/live/lib/detail/${liveId}`)

// 获取课程观看权限
export const getPermission = courseId => axios.get('/apis/v1/knowledgeCourse/customer/video', { params: { courseId } })

// 设置观看课程进度
export const setCourseProgress = (orderId, progress) => axios.get('/apis/v1/knowledgeCourse/updateMyVideo', { params: { orderId, progress } })

// 统计学习次数
export const setStudyCount = (videoId) => axios.get(`/apis/v1/mall/cource/addVod/${videoId}`)

// 统计观看的时间
export const setStudyTime = (videoId, watchTime) => axios.get(`/apis/v1/mall/cource/addWatchTime/${videoId}?watchTime=${watchTime}`)
/**
 * 统计视频播放信息，从而据此计费
 * @param data
 * @property data.id {string}
 * @property data.resourceId {string}
 * @property data.resourceName {string}
 * @property data.videoId {string}
 * @property data.videoTime {number}
 * @property data.watchTime {number}
 * @property data.dataFlowSize {number}
 * @returns {*}
 */
export const setLivePaidData = data => axios.post(`/apis/v1/mall/live/cost/recording`, data)
/**
 * 检查流量是否使用完
 * @returns {*}
 */
export const checkRateOfFlow = () => axios.get('/apis/v1/mall/live/cost/flowData/check')
