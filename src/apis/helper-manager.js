import axios from 'axios'

// Helper管理统计数据
export const getHelperData = () => axios.get('/apis/v1/systemctl/memberManager/helper/manager')

// 获取Helper列表
export const getHelperList = params => axios.get('/apis/v1/systemctl/memberManager/helper/list', { params })

// 获取Helper详情
export const getHelperDetail = params => axios.get('/apis/v1/systemctl/memberManager/member/detail', { params })

// 通过Helper申请
export const acceptHelperApplication = (sequenceNbr) => axios.put(`/apis/v1/agent/user/info/audit/${sequenceNbr}/PASS`)

// 驳回Helper申请
export const rejectHelperApplication = ({ sequenceNbr, agentWriteBack }) => axios.put(`/apis/v1/agent/user/info/audit/${sequenceNbr}/REJECT?agentWriteBack=${agentWriteBack}`)

// 获取Helper账号列表
export const getHelperRoleList = params => axios.get('/apis/v1/systemctl/account/roleUser/list', { params })
