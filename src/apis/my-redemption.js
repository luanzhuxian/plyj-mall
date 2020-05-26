import { axios } from '../assets/js/axios'

/**
 * 获取兑换码列表
 * @param params {Object} params.status 0：已过期  1-待使用  2-已使用
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRedemptionList = ({ current, size, status }) => axios.get(`/apis/v1/exchange/me/page?current=${ current }&size=${ size }&status=${ status }`)

/**
 * 删除兑换码
 * @param ids {Array} 需要删除的兑换码ids
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteRedemptionByIds = params => axios.post(`/apis/v1/exchange/delCode`, params)

/**
 * 获取当前兑换码 详情 + 可兑换的商品列表 + 已兑换列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getProductByCodeId = codeId => axios.get(`/apis/v1/exchange/detail/${ codeId }`)

/**
 * 外部扫码-获取兑换码详情
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRedemptiontInfo = code => axios.get(`/apis/v1/exchange/${ code }`)

/**
 * 激活兑换码
 * @returns {Promise<AxiosResponse<T>>}
 */
export const receiveRedemption = code => axios.put(`/apis/v1/exchange/activation/${ code }`)
