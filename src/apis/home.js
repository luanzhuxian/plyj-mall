import axios from 'axios'

// 获取首页模块数据
export const getHomeData = (agencyCode) => axios({ method: 'get', url: `/apis/v1/agency/mall/home/template/public/list?agencyCode=${agencyCode}` })
// 获取首页商品信息
export const getHomeProduct = (data) => axios({ method: 'post', url: `/apis/v1/product/productinfo/find/sale`, data })
