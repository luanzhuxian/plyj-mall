import axios from 'axios'
import { router } from '../../router'
import store from '../../store'
import { REFRESH_TOKEN } from '../../store/mutation-type'
// const mallInfo = JSON.parse(localStorage.getItem('mallInfo')) || {}
import Cookie from 'js-cookie'
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
    openId: Cookie.get('openId') || ''
  }
  return config
}

function reqError (error) {
  return Promise.reject(error)
}

async function response (response) {
  const data = response.data
  console.log(response)
  const config = response.config
  if (data.status !== 200) {
    let msg = data.message
    if (msg.indexOf('运行时') > -1) {
      msg = '服务器正在怀疑人生~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (msg.indexOf('登录信息失效') === -1 && msg.indexOf('Token失效') === -1) {
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
    // if (msg.indexOf('Token失效') > -1) {
    //   // 退出登录并重新登录
    //   store.commit(LOG_OUT)
    //   store.dispatch(LOGIN)
    //   return
    // }
    // 接口报‘登录信息失效，退出登录，并重新发起登录
    if (response.config.url !== '/apis/v1/account/account/info') {
      store.dispatch(REFRESH_TOKEN)
    }
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
