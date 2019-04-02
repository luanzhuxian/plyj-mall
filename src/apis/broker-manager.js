import axios from 'axios'
// 申请经纪人
export const AuditCreate = ({ idCard, mobile, name, verificationCode, weChatNumber }) =>
  axios.post(`/apis/v1/agent/user/info/audit/create`, { idCard, mobile, name, verificationCode, weChatNumber })
// 经纪人申请被驳回时，调用这个接口重新提交 sequenceNbr 经纪人id
export const updateAudit = (sequenceNbr, { idCard, mobile, name, verificationCode, weChatNumber }) =>
  axios.put(`/apis/v1/agent/user/info/audit/${sequenceNbr}`, { idCard, mobile, name, verificationCode, weChatNumber })
// GET 分页查询经纪人信息
export function agentUserInfoAuditPage ({ agencyCode, current, size }) {
  return axios.get(`/apis/v1/agent/user/info/audit/page?agencyCode=${agencyCode}&current=${current}&size=${size}`)
}
// GET 根据用户ID 与 机构码 查询用户经纪人信息
export const agentUserInfoAudit = (userId, code) => {
  return axios.get(`/apis/v1/agent/user/info/audit/${userId}/${code}`)
}
// PUT 修改经纪人审核状态
export function changeBrokerStatus (id) {
  return axios.put(`/v1/agent/user/info/audit/${id}/PASS`)
}
// PUT 修改经纪人信息
export function changeBrokerInfo (id, data) {
  return axios.post(`/apis/v1/agent/user/info/audit/${id}`, data)
}
// DELETE 删除经纪人
export function deleteBroker (id) {
  return axios.delete(`/apis/v1/agent/user/info/audit/${id}`)
}
