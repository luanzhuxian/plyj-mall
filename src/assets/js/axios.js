/* eslint-disable */
import Axios from 'axios'
export const axios = Axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  responseType: 'text'
})
import store from '../../store'
import { LOGIN } from '../../store/mutation-type'
import Cookie from '../../assets/js/storage-cookie'
class ResponseError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'ResponseError'
  }
}

/* code码 */
const SUCCESS_CODE = 2000
const EXCEPTION_CODE = 5000
const TOKEN_TIME_OUT = 4002

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
  const { data, config } = response
  // 正确响应
  if (data.code === SUCCESS_CODE) {
    data.result = data.data
    delete data.data
    return data
  }
  // 异常信息
  if (data.code === EXCEPTION_CODE) {
    return Promise.reject(new ResponseError(JSON.stringify({
      method: config.method,
      url: config.url,
      data: config.data ? JSON.parse(config.data) : null,
      params: config.params || null,
      devMessage: data.devMessage || '',
      message: data.message
    }, null, 4)))
  }
  // 登录信息过期
  if (data.code === TOKEN_TIME_OUT) {
    await store.dispatch(LOGIN)
    let { method, data, headers, url, params } = config
    return axios({
      method,
      data,
      params,
      url,
      headers: {
        openId: headers.openId
      }
    })
  }
  // if (data.code !== SUCCESS_CODE) {
  //   let msg = data.message
  //   let loginInvalid = msg.indexOf('登录信息失效') >= 0
  //   if (msg.indexOf('运行时') > -1) {
  //     msg = '蓬莱岛人太多啦~( ˶‾᷄࿀‾᷅˵ )'
  //   }
  //   // 非登录失效的错误
  //   if (!loginInvalid) {
  //     return Promise.reject(new ResponseError(JSON.stringify({
  //       method: config.method,
  //       url: config.url,
  //       data: config.data ? JSON.parse(config.data) : null,
  //       params: config.params || null,
  //       devMessage: data.devMessage || '',
  //       message: msg || ''
  //     }, null, 4)))
  //   }
  //   // 重新登录, 登录完成后尝试上次发起的请求
  //   try {
  //     await store.dispatch(LOGIN)
  //     let { method, data, headers, url, params } = config
  //     const res = await axios({
  //       method,
  //       data,
  //       params,
  //       url,
  //       headers: {
  //         openId: headers.openId
  //       }
  //     })
  //     return httpToHttps(res)
  //   } catch (e) {
  //     return Promise.reject(e)
  //   }
  // }
  // return data
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
  }
  return Promise.reject(new ResponseError(JSON.stringify({
    message: msg
  }, null, 4)))
}
// 将数据中存在的资源http协议改成https协议
function httpToHttps (data) {
  try {
    let temp = JSON.stringify(data)
    temp = temp.replace(/http:\/\/mallcdn.youpenglai.com/g, 'https://mallcdn.youpenglai.com')
    temp = temp.replace(/http:\/\/penglai-weimall.oss-cn-hangzhou.aliyuncs.com/g, 'https://mallcdn.youpenglai.com')
    return JSON.parse(temp)
  } catch (e) {
    return data
  }
}
