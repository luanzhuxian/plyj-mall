import axios from 'axios'

// 申请经纪人
export const AuditCreate = ({ idCard, mobile, name, verificationCode, weChatNumber, shareUserId }) => axios.post(`/apis/v2/helper`, { idCard, mobile, name, verificationCode, weChatNumber, shareUserId })

// 经纪人申请被驳回时，调用这个接口重新提交 sequenceNbr 经纪人id
export const updateAudit = (sequenceNbr, { idCard, mobile, name, verificationCode, weChatNumber, shareUserId }) => axios.put(`/apis/v2/agent/user/info/audit/${ sequenceNbr }`, { idCard, mobile, name, verificationCode, weChatNumber, shareUserId })

// GET 分页查询经纪人信息
export const agentUserInfoAuditPage = ({ current, size }) => axios.get(`/apis/v2/agent/user/info/audit/page?current=${ current }&size=${ size }`)

// GET 根据用户ID 与 机构码 查询用户经纪人信息
export const agentUserInfoAudit = () => axios.get(`/apis/v2/agent/user/info/audit`)

export const getAduitNotice = () => axios.get(`/apis/v2/agent/user/info/audit/notice`)

export const updateNoticeStatus = () => axios.put(`/apis/v2/agent/user/info/audit/updateNoticeStatus`)

// PUT 修改经纪人审核状态
export const changeBrokerStatus = id => axios.put(`/apis/v2/agent/user/info/audit/${ id }/PASS`)

// PUT 修改经纪人信息
export const changeBrokerInfo = (id, data) => axios.post(`/apis/v2/agent/user/info/audit/${ id }`, data)

// DELETE 删除经纪人
export const deleteBroker = id => axios.delete(`/apis/v2/agent/user/info/audit/${ id }`)
