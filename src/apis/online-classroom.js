import { axios } from '../assets/js/axios'
export const getNewFreight = () => axios.get('/apis/v1/order/logistics/order/waitReceive')

// 查询线上课程列表
export const getCourseInfo = params => axios.get('/apis/v1/knowledgeCourse/onlineClassroom', { params })
