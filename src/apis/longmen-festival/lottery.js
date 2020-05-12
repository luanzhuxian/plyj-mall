import { axios } from '../../assets/js/axios'

/**
 * 获取可用抽奖次数
 * @param activityId {string}
 * @returns {Promise<Object>}
 */
export const getLotteryCount = activityId => axios.get(`/apis/v1/luckdraw/available_luck_draw/${ activityId }`)

/**
 * 获取抽奖活动详情
 * @param activityId {string}
 * @returns {Promise<Object>}
 */
export const getDetail = activityId => axios.get(`/apis/v1/luckdraw/detail/${ activityId }`)

/**
 * 获取中奖记录
 * @param activityId
 * @returns {*}
 */
export const getLotteryRecords = activityId => axios.get(`/apis/v1/luckdraw/my_award/${ activityId }`, { params: { size: 10e5, current: 1 } })

/**
 * 获取我中过的奖品
 * @param activityId
 * @returns {*}
 */
export const getAwardRecords = (activityId, current = 1) => axios.get(`/apis/v1/luckdraw/award/${ activityId }`, { params: { size: 20, current } })

/**
 * 抽奖
 * @param activityId {string}
 * @returns {*}
 */
export const lottery = activityId => axios.post(`/apis/v1/luckdraw/${ activityId }`)

/**
 * 设置首次访问，每天只访问一次
 * @returns {*}
 */
export const setFirstVisit = async () => axios.post('/apis/v1/luckdraw/visit')
