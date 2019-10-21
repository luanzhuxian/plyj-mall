import { axios } from '../assets/js/axios'

export const helpFriend = (activityId, friendId) => axios.put(`/apis/v1/invitingEvents/${activityId}/help/${friendId}`)

// export const getInviteDetail = (activityId) => axios.get(`/apis/v1/invitingEvents/${activityId}`)

export const canClaimGift = (activityId) => axios.get(`/apis/v1/invitingEventsGift/${activityId}/canClaimGift`)

export const claimGiftOrCoupon = (activityId, userId) => axios.post(`/apis/v1/invitingEventsGift/${activityId}/claimGiftOrCoupon`, { baseUserId: userId })

export const getHelpers = (activityId, userId) => axios.get(`/apis/v1/invitingEvents/${activityId}/userIds/${userId}/helpers`)

export const getActivityInfo = (activityId) => axios.get(`/apis/v1/invitingEvents/${activityId}/baseInfo`)

export const getClaimGiftList = (activityId) => axios.get(`/apis/v1/invitingEvents/page/claimGift/baseInfo`, { params: { activityId } })

// FIXME: 一时没有看到这个API在什么地方有定义
export const getUserInfo = (userId) => axios.post(`/apis/v1/mallActivitys/${userId}/info`)

export const getActivityStatisiticData = (activityId) => axios.get(`/apis/v1/invitingEventsGift/${activityId}/statGiftData`)

export const getCurrentActivity = () => axios.get('/apis/v1/invitingEvents/currActiviy/baseInfo')

export const inviterStatisitic = (activityId) => axios.put(`/apis/v1/mallActivitys/${activityId}/inviter/stat`)
