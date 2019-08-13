import axios from 'axios'
// 提交用户注册信息
export const getInfo = data =>
  axios.post('/apis/v1/base/baseIntentionUser/collectinfo', data)
// 获取确认页面数据
export const getConfirmInfo = () =>
  axios.post('/apis/v1/base/baseIntentionUser/waitReceive')
// 判断是否注册
export const wasRegist = () =>
  axios.post('/apis/v1/base/baseIntentionUser/querysDetail')
// 获取注册信息
export const getRegisterInfo = () =>
  axios.post('/apis/v1/base/baseIntentionUser/getPageInfo')
// 确定领取
export const confirmGet = data =>
  axios.post('/apis/v1/base/baseIntentionUser/receiveGift', data)
