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
