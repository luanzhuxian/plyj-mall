import { axios } from '../assets/js/axios'
// export const submitComment = (openId, params) => axios.post(`/apis/v1/orderProduct/assessment/create?openId=${ openId }`, params)

//  商城端-评论列表查询
export const getComments = params => axios.get(`/apis/v1/orderProduct/assessment/front/page`, { params })

/**
 * 提交评论
 * @param {}
 * @return {*}
 */
export const submitComment = params => axios.post(`/apis/v2/order/comment`, params)
