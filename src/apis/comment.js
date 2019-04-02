import axios from 'axios'
export function submitComment (openId, data) {
  return axios.post(`/apis/v1/assessment/Assessment?openId=${openId}`, data)
}
//  商城端-评论列表查询
export const getComments = ({ current, size, mallSeq, productSeq }) =>
  axios.get(`/apis/v1/assessment/Assessment/front/page?mallSeq=${mallSeq}&productSeq=${productSeq}&current=${current}&size=${size}`)
