import axios from 'axios'
// 分页查询提现记录
export function getWithdrawDeposit ({ agencyCode, current, size, userName, createTime }) {
  return axios.get(`/apis/v1/agent/user/withdraw/deposit/page?agencyCode=${agencyCode}&current=${current}&size=${size}&userName=${userName}&createTime=${createTime}`)
}
// 分页查询当前登录用户提现记录
export const getWithdrawDepositOfUser = ({ agencyCode, current, size, status }) =>
  axios.get(`/apis/v1/agent/user/withdraw/deposit/page/user?agencyCode=${agencyCode}&current=${current}&size=${size}&status=${status}`)
// 提现详情
export function getWithdrawDepositDetail (sequenceNbr) {
  return axios.get(`/apis/v1/agent/user/withdraw/deposit/${sequenceNbr}`)
}
// 提现
export const withdrawDeposit = (data) =>
  axios.post('/apis/v1/agent/user/withdraw/deposit', data)
// 佣金明细列表
export const getBrokerageList = ({ current, size, userId, status, agencyCode }) =>
  axios.get(`/apis/v1/agent/user/share/price/record/page/user?current=${current}&size=${size}&userId=${userId}&status=${status}&agencyCode=${agencyCode}`)
// 获取提现明细个状态的数量
export function getDepositCount () {
  return axios.get(`/apis/v1/agent/user/withdraw/deposit/statistics`)
}
