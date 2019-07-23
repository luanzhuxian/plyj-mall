import axios from 'axios'
/**
 * 学员信息新增
 * @param data {Object} {defaultStatus, stuMobile, stuName}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const add = data => axios.post('/apis/v1/studentmanagement', data)
/**
 * 学员信息删除
 * @param data {Array} [id]
 * @returns {Promise<AxiosResponse<T>>}
 */
export const remove = data => axios.post('/apis/v1/studentmanagement/delete', data)
/**
 * 学员信息查询
 * @param data {Object} {current, size}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getList = () => axios.get('/apis/v1/studentmanagement/find')
/**
 * 学员信息编辑
 * @param data {Array} [{defaultStatus, stuMobile, stuName, id}]
 * @returns {Promise<AxiosResponse<T>>}
 */
export const edit = data => axios.post('/apis/v1/studentmanagement/update', data)
/**
 * 学员信息详情
 * @param id {String}
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getDetail = id => axios.get('/apis/v1/studentmanagement/findById', { params: { id } })
