import axios from 'axios'
// 雅集商城收集或者修改用户注册信息
export const getInfo = data =>
  axios.post('/apis/v1/base/baseIntentionUser/collectinfo', data)
