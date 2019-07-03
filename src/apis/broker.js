import axios from 'axios'

/**
 * 获取经纪人分享所有商品
 * @param params
 */
export const getActivityProduct = (params) => axios({ method: 'get', url: '/apis/v1/product/page/agent', params })
