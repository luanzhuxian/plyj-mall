import { axios } from '../assets/js/axios'
/**
 * 获取战报详情
 * @param id {string} 数据
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getReportDetail = id => axios.get(`/apis/v1/epidemicInformation/detail/${id}`)
