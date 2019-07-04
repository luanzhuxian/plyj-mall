import axios from 'axios'
export function submitComment (openId, data) {
  return axios.post(`/apis/v1/assessment/Assessment?openId=${openId}`, data)
}
//  商城端-评论列表查询
export const getComments = (params) =>
  axios.get(`/apis/v1/orderProduct/assessment/front/page`, { params })
