import { axios } from '../../assets/js/axios'

/**
 * 公益活动详情
 * @param {string} activityId
 */
export const getPublicBenefitDetail = activityId => axios.get(`/apis/v1/commonweal/${ activityId }/detail?type=C`)

/**
 * 公益行动统计
 * @param {string} activityId
 */
export const getPublicBenefitStatistics = activityId => axios.get(`/apis/v1/commonweal/${ activityId }/statistics`)

/**
 * 公益榜单
 * @param {string} activityId
 */
export const getPublicBenefitList = activityId => axios.get(`/apis/v1/commonweal/${ activityId }/list`)
