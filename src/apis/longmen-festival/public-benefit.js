
import axios from 'axios'

/**
 * 公益活动详情
 * @param {string} activityId
 */
export const getPublicBenefitDetail = activityId => axios.get(`/apis/v1/commonweal/${ activityId }/detail?type=C`)

/**
 * 公益行动统计
 * @param {string} activityId
 */
export const getPublicBenefitStatistics = activityId => axios.get(`/apis/v2/commonweal/${ activityId }/statistics`)

/**
 * 公益榜单
 * @param {string} activityId
 * @param {string} productId
 */
export const getPublicBenefitList = ({ activityId, productId = '' }) => axios.get(`/apis/v2/commonweal/${ activityId }/list?productId=${ productId }`)
