import axios from 'axios'

// Helper管理统计数据
export const getHelperData = () => axios.get('/apis/v1/systemctl/memberManager/helper/manager')

// 获取Helper列表
export const getHelperList = params => axios.get('/apis/v1/systemctl/memberManager/helper/list', { params })

// 获取Helper详情
export const getHelperDetail = params => axios.get('/apis/v1/systemctl/memberManager/member/detail', { params })

// 修改Helper申请审核状态 status PASS: 通过, REJECT: 驳回
export const changeHelperApplication = (sequenceNbr, status) => axios.put(`/apis/v1/agent/user/info/audit/${sequenceNbr}/${status}`)
