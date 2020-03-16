import { axios } from '../assets/js/axios'

// 分页查询提现记录
export const getWithdrawDeposit = params => axios.get(`/apis/v1/agent/user/withdraw/deposit/page`, { params })

// 分页查询当前登录用户提现记录
export const getWithdrawDepositOfUser = params => axios.get(`/apis/v1/agent/user/withdraw/deposit/page/user`, { params })

// 提现详情
export const getWithdrawDepositDetail = sequenceNbr => axios.get(`/apis/v1/agent/user/withdraw/deposit/${ sequenceNbr }`)

// 提现
export const withdrawDeposit = data => axios.post('/apis/v1/agent/user/withdraw/deposit', data)

// 佣金明细列表
export const getBrokerageList = params => axios.get(`/apis/v1/agent/user/share/price/record/page/user`, { params })

// 获取提现明细个状态的数量
export const getDepositCount = () => axios.get(`/apis/v1/agent/user/withdraw/deposit/statistics`)
