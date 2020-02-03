import { axios } from '../assets/js/axios'
/**
 * 获取战报详情
 * @param id {string} 数据
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getReportDetail = id => axios.get(`/apis/v1/epidemicInformation/detail/${id}`)

// 查询该机构的战报活动
export const getReportActivity = () => axios.get('/apis/v1/epidemicInformation')

// 查询该机构的志愿书活动
export const getBookActivity = () => axios.get('/apis/v1/epidemic/has_epidem_activity')
// 报名
export const signUp = data => axios.post('/apis/v1/epidemicActivity/signUp', data)
// 报名数据
export const signInfo = activityId => axios.get(`/apis/v1/epidemicActivity/querySignUpInfo/${activityId}`)
