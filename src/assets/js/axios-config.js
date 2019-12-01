/* eslint-disable */
import { axios } from './axios'
import store from '../../store'
import { REFRESH_TOKEN, LOGIN } from '../../store/mutation-type'
import Cookie from '../../assets/js/storage-cookie'
class ResponseError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'ResponseError'
  }
}
// 添加请求拦截器
axios.interceptors.request.use(request, reqError)
// 添加响应拦截器
axios.interceptors.response.use(response, resError)

function request (config) {
  let mallDomain = location.pathname.split('/')[1]
  config.headers.openId = localStorage.getItem(`openId_${mallDomain}`) || ''
  config.headers.mallId = Cookie.get('mallId')
  config.headers.agencyCode = Cookie.get('agencyCode')
  config.headers.token = Cookie.get('token')
  config.headers.refresh_token = Cookie.get('refresh_token')
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
    let loginInvalid = msg.indexOf('登录信息失效') >= 0
    let tokenInvalid = msg.indexOf('Token失效') >= 0
    if (msg.indexOf('运行时') > -1) {
      msg = '蓬莱岛人太多啦~( ˶‾᷄࿀‾᷅˵ )'
    }
    if (!loginInvalid && !tokenInvalid) {
      let err = {
        method: config.method,
        url: config.url,
        data: config.data ? JSON.parse(config.data) : null,
        params: config.params || null,
        devMessage: data.devMessage || '',
        message: msg || ''
      }
      return Promise.reject(new ResponseError(JSON.stringify(err, null, 4)))
    }
    // 刷新token还没失效
    if (!tokenInvalid) {
      try {
        await store.dispatch(REFRESH_TOKEN)
        let config = response.config
        let { method, data, headers, url } = config
        const res = await axios({
          method,
          data,
          url,
          headers: {
            openId: headers.openId
          }
        })
        return res
      } catch (e) {
        return Promise.reject(e)
      }
    } else {
      await store.dispatch(LOGIN)
      return
    }
  }
  return data
}

function resError (error) {
  let msg = error.message
  if (msg.indexOf('timeout') > -1) {
    msg = '请求超时◔̯◔'
  }
  if (msg.indexOf('40') > -1) {
    msg = '您似乎在蓬莱岛迷路了'
  }
  if (msg.indexOf('50') > -1) {
    msg = '蓬莱岛消失在了迷雾中~( ˶‾᷄࿀‾᷅˵ )'
  }
  if (msg.indexOf('Network Error') > -1) {
    msg = '网络不给力'
    // router.push({ name: 'NetError' })
    return
  }
  return Promise.reject(new ResponseError(JSON.stringify({
    message: msg
  }, null, 4)))
}
