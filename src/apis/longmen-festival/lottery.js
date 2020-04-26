import { axios } from '../../assets/js/axios'
import Cookie from '../../assets/js/storage-cookie'
import moment from 'moment'

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
export const getAwardRecords = activityId => axios.get(`/apis/v1/luckdraw/award/${ activityId }`, { params: { size: 10e5, current: 1 } })

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
export const setFirstVisit = () => {
    // 设置标记，当天23:59:59过期
    const FIRST_VISIT = Cookie.get('FIRST_VISIT')
    if (!FIRST_VISIT) {
        Cookie.set('FIRST_VISIT', 1, {
            expires: moment()
                .endOf('day')
                .valueOf()
        })
        return axios.post('/apis/v1/luckdraw/visit')
    }
}
