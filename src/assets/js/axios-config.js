import axios from 'axios'
import { router } from '../../router'
import store from '../../store'
import { LOG_OUT, LOGIN } from '../../store/mutation-type'

axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}
axios.defaults.timeout = 15000
// 添加请求拦截器
axios.interceptors.request.use(request, reqError)
// 添加响应拦截器
axios.interceptors.response.use(response, resError)

function request (config) {
  config.headers = {
    token: store.state.token || null,
    agencyCode: store.state.mallInfo.agencyCode || '',
    openId: store.state.openId || '',
    mallId: store.state.mallInfo.mallSeq,
    domainName: window.location.pathname.split('/')[1] || ''
  }
  return config
}

function reqError (error) {
  return Promise.reject(error)
}

async function response (response) {
  const data = response.data
  const config = response.config
  if (data.status !== 200) {
    let msg = data.message
    if (msg.indexOf('运行时') > -1) {
      msg = '服务器正在怀疑人生~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (msg.indexOf('登录信息失效') === -1) {
      let err = {
        tag: 'responseError',
        method: config.method,
        url: response.config.url,
        data: config.data ? JSON.parse(config.data) : null,
        params: config.params || null,
        devMessage: data.devMessage || '',
        message: msg || ''
      }
      return Promise.reject(new Error(JSON.stringify(err)))
    }
    // 接口报‘登录信息失效’， 退出登录，并重新发起登录
    store.commit(LOG_OUT)
    store.dispatch(LOGIN)
    return Promise.reject(new Error(msg))
  }
  return data
}

function resError (error) {
  let msg = error.message
  if (msg.indexOf('timeout') > -1) {
    msg = '请求超时◔̯◔'
  }
  if (msg.indexOf('40') > -1) {
    msg = '请求未找到'
  }
  if (msg.indexOf('50') > -1) {
    msg = '服务器正在开小差~( ˶‾᷄࿀‾᷅˵ )'
  }
  if (msg.indexOf('Network Error') > -1) {
    router.push({ name: 'NetError' })
    return
  }
  return Promise.reject(new Error(msg))
}
