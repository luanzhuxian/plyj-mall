import axios from 'axios'
/**
 * 预约
 * @param data {Object} { mobile, openId }
 * @returns {Promise<AxiosResponse<T>>}
 */
export const yuyue = data => axios.post('/apis/v1/base/reservation', data)
export const getData = data => axios.get('/apis/v1/brand/branding/query')
