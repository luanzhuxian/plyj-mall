import axios from 'axios'

/**
 * 新增机构信息
 * @return {*}
 */
export const createInfo = () => axios.post(`/apis/v1/mall/doublet/twelve/create`)

/**
 * 用户助力
 * @return {*}
 */
export const userHelp = () => axios.post(`/apis/v1/mall/doublet/twelve/like`)

/**
 * 分页查询机构信息
 * @return {*}
 */
// export const getEntList = params => axios.get(`/apis/v1/mall/doublet/twelve/page`, { params })
/**
 * 在线预约
 * @param params
 * @return {*}
 */
export const appointmentOnline = params => axios.post(`/apis/v1/mall/doublet/twelve/reservation`, params)

/**
 * 查询机构详情
 * @param params
 * @return {*}
 */
export const getEntDetail = () => axios.get('/apis/v1/mall/doublet/twelve/select')
