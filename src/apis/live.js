/* eslint-disable */
import axios from 'axios'

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
// export const sendMessage = data => {
//     data = createFormData(data)
//     return axios.post('/live/v3/channel/chat/send-admin-msg', data)
// }
/**
 * 设置会暖场图片
 * @param channelId {number}
 * @param data {object}
 * @property data.appId {string}
 * @property data.timestamp {string}
 * @property data.coverImage {string}
 * @property data.coverHref {string}
 * @property data.sign {string}
 * @return {Promise<AxiosResponse<T>>}
 */
// export const setcCverImg = (channelId, data) => axios.post(`http://api.polyv.net/live/v2/channels/${ channelId }/update`, data)
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
// export const sendCustomMessage = (channelId, data) => {
//     data = createFormData(data)
//     return axios.post(`/live/v1/channelSetting/${ channelId }/send-chat`, data)
// }
/**
 * 从我们服务器获取去签名
 * @param data {Object} 要签名的字符串
 * roomId { Integer } 房间号
 * signMsg { String } 加密消息
 * @returns {Promise<AxiosResponse<T>>}
 */
export const sign = data => axios.post(`/apis/v1/mall/live/room/sign`, data)
/**
 * 根据 roomValue 获取直播活动全部信息
 * @param roomValue
 * @return {Promise<AxiosResponse<T>>}
 */
export const getActiveCompleteInfo = (roomValue = '') => axios.get(`/apis/v1/mall/live/activity/current/complete?roomValue=${ roomValue }`)

/**
 * 根据活动 id 获取直播活动全部信息
 * @param id
 * @return {Promise<AxiosResponse<T>>}
 */
export const getPlayBackActiveCompleteInfo = id => axios.get(`/apis/v1/mall/live/activity/detail/${id}`)
/**
 * 获取直播信息
 */
export const getRoomStatus = () => axios.get(`/apis/v1/mall/live/room/statue`)
/**
 * 是否支付过
 * @param liveActivityId {String}
 * @return {Promise<AxiosResponse<T>>}
 */
export const hasPied = liveActivityId => axios.post(`/apis/v1/mall/live/order/customer/payed?liveActivityId=${ liveActivityId }`)
/**
 * 设置用户进入直播间
 * @param params
 * @return {Promise<AxiosResponse<T>>}
 */
export const setComeInConut = params => axios.get(`/apis/v1/mall/live/activity/watchLog`, {
    params
})

//查看用户是否有权限观看
export const hasPermission = activityId => axios.put(`/apis/v1/mall/live/activity/isGive/${ activityId }`)


// 根据直播ID从视频库获取视频详情（仅限录播）
export const getVideoMesById = id => axios.get(`/apis/v1/mall/live/lib/detail/${ id }`)

// 输入直播口令
export const inputLivePassword = ({ activityId, roomToken }) => axios.get(`/apis/v1/mall/live/lib/activity/${ activityId }`, { params: { roomToken } })

//直播报名
export const liveSignUp = data => axios.post('/apis/v1/mall/live/c_live_signUp', data)

//查询直播是否开始
export const isLiveStart = stream => axios.get(`/apis/v1/mall/live/room/tatus?stream=${ stream }`)

// 查询签到记录
export const getSignInList = params => axios.get('https://api.polyv.net/live/v3/channel/chat/get-checkins',{ params })

// 查询提问记录
export const getQuestionList = channelId => axios.get(`/apis/v1/mall/live/chat/${channelId}/getQuestion`)

/**
 * 暖场开关
 * @param data {Object} 请求参数
 * @property data.appId
 * @property data.timestamp
 * @property data.sign
 * @property data.channelId
 * @property data.warmUpEnabled Y or N
 * @returns {Promise<AxiosResponse<T>>}
 */
export const setWarmup = data => axios.post('https://api.polyv.net/live/v3/channel/set-warmup-enabled', data)

