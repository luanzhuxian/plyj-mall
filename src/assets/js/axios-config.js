import axios from 'axios'
import { router } from '../../router'
import Toast from '../../components/penglai-ui/toast'
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
  /* 刷新token创建时间 */
  let token = localStorage.getItem('token')
  // let token = '3fdbc8d5-27f1-4e1b-9d75-5b799f7afb97'
  config.headers = {
    product: 'welcome_to_penglai_yaji',
    tokenType: 'wechat',
    token: token || null,
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
    if (data.message.indexOf('运行时') > -1) {
      msg = '服务器正在怀疑器生~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (data.message.indexOf('登录信息失效') === -1) {
      Toast(msg)
      let err = {
        tag: 'responseError',
        method: config.method,
        url: response.config.url,
        data: config.data ? JSON.parse(config.data) : null,
        params: config.params || null,
        devMessage: data.devMessage || '',
        message: data.message || ''
      }
      return Promise.reject(new Error(JSON.stringify(err)))
    }
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
  if (msg.indexOf('Network Error') === -1) {
    Toast(msg)
  } else {
    router.push({ name: 'NetError' })
  }
  return Promise.reject(msg)
}
