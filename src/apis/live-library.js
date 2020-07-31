
import { axios } from '../assets/js/axios'

// 获取直播观看列表
export const getLibraryList = params => axios.get('/apis/v1/mall/live/lib/my_lookback', { params })

// 直播回放信息
export const getLivePlayBackInfo = (activityId, isValidateEndTime) => axios.get(`/apis/v1/mall/live/lib/lookback/${ activityId }?isValidateEndTime=${ isValidateEndTime }`)

// 获取课程列表
export const getCourseList = params => axios.get('/apis/v1/knowledgeCourse/myVideo', { params })

// 获取课程学习数量
export const getCourseStudyNum = courseType => axios.get(`/apis/v1/knowledgeCourse/myVideoTotalCount`, { params: { courseType } })

// 获取课程观看权限
export const getPermission = courseId => axios.get('/apis/v1/knowledgeCourse/customer/video', { params: { courseId } })

// 设置观看课程进度
export const setCourseProgress = ({ orderId, liveId, progress }) => axios.get('/apis/v1/knowledgeCourse/updateMyVideo', { params: { orderId, liveId, progress } })

// 统计学习次数
export const setStudyCount = ({ courseId, liveId }) => axios.get(`/apis/v1/mall/cource/addVod/${ courseId }/${ liveId }`)

// 统计观看的时间
export const setStudyTime = ({ courseId, liveId, watchTime }) => axios.get(`/apis/v1/mall/cource/addWatchTime/${ courseId }/${ liveId }?watchTime=${ watchTime }`)

// 是否有权限观看课程
export const isRange = courseId => axios.get(`/apis/v1/knowledgeCourse/isRange/${ courseId }`)

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

/**
 * 获取我的图文资料
 * @param params {Object}
 * @property params.size {Number}
 * @property params.current {Number}
 * @property params.courseType
 * @return {*}
 */
export const getMyImageText = params => axios.get('/apis/v1/graphic/myGraphic', { params })
