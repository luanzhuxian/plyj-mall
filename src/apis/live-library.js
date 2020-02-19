
import { axios } from '../assets/js/axios'

// 获取直播观看列表
export const getLibraryList = () => axios.get('/apis/v1/mall/live/lib/my_lookback')

// 获取课程列表
export const getCourseList = params => axios.get('/apis/v1/knowledgeCourse/myVideo', { params })

// 获取观看课程信息
export const getCourseDetail = liveId => axios.get(`/apis/v1/mall/live/lib/detail/${liveId}`)

// 获取课程观看权限
export const getPermission = courseId => axios.get('/apis/v1/knowledgeCourse/customer/video', { params: { courseId } })

// 设置观看课程进度
export const setCourseProgess = (orderId, progress) => axios.get('/apis/v1/knowledgeCourse/updateMyVideo', { params: { orderId, progress } })
