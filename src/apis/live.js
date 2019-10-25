/* eslint-disable */
import Axios from 'axios'
const Instance = Axios.create({
  timeout: 15000
})
class ResponseError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'ResponseError'
  }
}
// 添加请求拦截器
Instance.interceptors.request.use(request, reqError)
// 添加响应拦截器
Instance.interceptors.response.use(response, resError)

/**
 * 通过HTTP接口在聊天室发送消息
 * @param data { Object }
 * appId     (必填)  { String } 从API设置中获取，在直播系统登记的appId
 * timestamp (必填)  { String } 当前时间的秒级时间戳（13位）
 * sign      (必填)  { String } 签名，为32位大写的MD5值
 * channelId (必填)  { Integer }频道号
 * adminIndex       { Integer }管理员索引，可以指定多个管理员发送消息，默认只有一个管理员
 * msg       (必填)  { String } 发送的文本消息
 * pic       (必填)  { String } 管理员头像
 * nickName  (必填)  { String } 昵称，最大为8个长度，超出会被截断
 * actor             { String } 头衔，最大为4个长度，超出会被截断，不传参数则表示无头衔
 * freeReview        { String } 当频道开启审核后消息是否需要经过审核，Y表示不需要，N表示需要，默认为N
 * @returns {Promise<AxiosResponse<T>>}
 */
export const sendMessage = data => {
  data = createFormData(data)
  return Instance.post('/live/v3/channel/chat/send-admin-msg', data)
}
/**
 * 发送自定义消息
 * @param channelId (必填)  { Integer }频道号
 * @param data { Object } 请求参数
 * userId           直播账号ID
 * appId            从API设置中获取，在直播系统登记的appId
 * sign             签名，为32位大写的MD5值
 * timestamp        当前13位毫秒级(兼容10位秒级)时间戳，3分钟内有效
 * content/imgUrl   需要发送的图片或是文字，二者不能同时为空，可以同时提交, content需要进行base64编码，编码规则参(http://dev.polyv.net/2016/liveproduct/zblts/send-chat/)
 * @returns {Promise<AxiosResponse<T>>}
 */
export const sendCustomMessage = (channelId, data) => {
  data = createFormData(data)
  return Instance.post(`/live/v1/channelSetting/${channelId}/send-chat`, data)
}
/**
 * 从我们服务器获取去签名
 * @param data {Object} 要签名的字符串
 * roomId { Integer } 房间号
 * signMsg { String } 加密消息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const sign = data => Instance.post(`/apis/v1/mall/live/room/sign`, data)
/**
 * 获取直播活动全部信息
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 */
export const getActiveCompleteInfo = (id = '') => Instance.get(`/apis/v1/mall/live/activity/current/complete?id=${id}`)
/**
 * 获取直播信息
 */
export const getRoomStatus = () => Instance.get(`/apis/v1/mall/live/room/statue`)

function request (config) {
  return config
}
function reqError (error) {
  return Promise.reject(error)
}
function response (response) {
  const data = response.data
  if (data.code === 200 || data.status === 200) {
    if (data.hasOwnProperty('result')) {
      return data.result
    }
    return data
  }
  return Promise.reject(new ResponseError(data.message))
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
    msg = '网络连接失败'
  }
  return Promise.reject(new ResponseError(msg))
}

// 生成formData数据
function createFormData (obj) {
  let keys = Object.keys(obj)
  let formData = new FormData()
  for (let k of keys) {
    formData.append(k, obj[k])
  }
  return formData
}
