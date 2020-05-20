import { axios } from '../assets/js/axios'

/**
 * 获取兑换码列表
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRedemptionList = ({ current, size, status }) => axios.get(`/apis/v1/coupon/center/list?current=${ current }&size=${ size }&status=${ status }`)

/**
 * 删除兑换码
 * @param ids {Array} 需要删除的兑换码ids
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteRedemptionByIds = ids => axios.post(`/apis/v1/coupon/center/list`, { ids })

/**
 * 获取兑换码详情
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRedemptiontDetail = ({ current, size, status }) => axios.get(`/apis/v1/coupon/center/list?current=${ current }&size=${ size }&status=${ status }`)

/**
 * 获取兑换码详情
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getProductByCodeId = ({ codeId, status, current, size }) => axios.get(`/apis/v1/coupon/center/list?&codeId=${ codeId }&status=${ status }current=${ current }&size=${ size }`)

/**
 * 兑换商品
 * @returns {Promise<AxiosResponse<T>>}
 */
export const exchangeProduct = ({ codeId, productId }) => axios.get(`/apis/v1/coupon/center/list?codeId=${ codeId }&productId=${ productId }`)

/**
 * 获取兑换码详情
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getRedemptiontInfo = codeId => axios.get(`/apis/v1/coupon/center/list/codeId`)

/**
 * 激活兑换码
 * @returns {Promise<AxiosResponse<T>>}
 */
export const receiveRedemption = codeId => axios.get(`/apis/v1/coupon/center/list/codeId`)
