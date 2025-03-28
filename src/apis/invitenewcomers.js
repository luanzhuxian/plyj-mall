import axios from 'axios'

/**
 * 助力
 * @param activityId {string}
 * @param friendId {string}
 * @return {Promise<*|*>|Promise<*|*>|Promise<AxiosResponse<T>>|IDBRequest<IDBValidKey>|Promise<void>}
 */
export const helpFriend = (activityId, friendId) => axios.put(`/apis/v1/invitingEvents/${ activityId }/help/${ friendId }`)

// export const getInviteDetail = (activityId) => axios.get(`/apis/v1/invitingEvents/${activityId}`)

/**
 * 是否可开豪礼
 * @param activityId
 * @return {*}
 */
export const canClaimGift = activityId => axios.get(`/apis/v1/invitingEventsGift/${ activityId }/canClaimGift`)

export const claimGiftOrCoupon = (activityId, userId) => axios.post(`/apis/v1/invitingEventsGift/${ activityId }/claimGiftOrCoupon`, { baseUserId: userId })

/**
 * 获取助力好友列表
 * @param activityId
 * @param userId
 * @return {*}
 */
export const getHelpers = (activityId, userId) => axios.get(`/apis/v1/invitingEvents/${ activityId }/userIds/${ userId }/helpers`)

/**
 * 获取活动基本信息
 * @param activityId {string}
 * @return {*}
 */
export const getActivityInfo = activityId => axios.get(`/apis/v1/invitingEvents/${ activityId }/baseInfo`)

/**
 * 获取已获得好礼晒单
 * @param activityId
 * @return {*}
 */
export const getClaimGiftList = activityId => axios.get(`/apis/v1/invitingEvents/page/claimGift/baseInfo`, { params: { activityId } })

// export const getUserInfo = userId => axios.post(`/apis/v1/mallActivitys/${ userId }/info`)

/**
 * 发放礼物的数量
 * @param activityId
 * @return {*}
 */
export const getActivityStatisiticData = activityId => axios.get(`/apis/v1/invitingEventsGift/${ activityId }/statGiftData`)

/**
 * 获取活动基础信息
 * @return {*}
 */
export const getCurrentActivity = () => axios.get('/apis/v1/invitingEvents/currActiviy/baseInfo')

/**
 * 统计分享次数（被点击的分享才算）
 * @param activityId
 * @param userId
 * @return {Promise<*|*>|Promise<*|*>|Promise<AxiosResponse<T>>|IDBRequest<IDBValidKey>|Promise<void>}
 */
export const inviterStatisitic = (activityId, userId) => axios.put(`/apis/v1/mallActivitys/${ activityId }/inviter/stat?userId=${ userId }`)

/**
 * 新人助力完以后调用
 * @param activityId
 * @return {*}
 */
export const registerStatisitic = activityId => axios.post(`/apis/v1/mallActivitys/${ activityId }/register/stat`)

/**
 * 获取活动详细信息
 * @param activityId {string}
 * @return {*}
 */
export const getActiveDetail = activityId => axios.get(`/apis/v1/invitingEvents/info/${ activityId }`)

/**
 * 开豪礼
 * @param activityId {string}
 * @param data {object}
 * @property data.baseUserId {string}
 * @return {*}
 */
export const openGift = activityId => axios.post(`/apis/v1/invitingEventsGift/${ activityId }/claimGiftOrCoupon`)
